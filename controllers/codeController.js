// backend/controllers/codeController.js
const axios = require('axios');
const LANGUAGES = require('../config/languages');
const ExecutionModel = require('../models/ExecutionModel');

// ── Judge0 CE Language IDs ────────────────────────────────────────
// Full list: https://ce.judge0.com/languages
const JUDGE0_LANG_IDS = {
  python:     71,
  java:       62,
  cpp:        54,
  c:          50,
  csharp:     51,
  javascript: 63,
  php:        68,
  typescript: 74,
  ruby:       72,
  go:         60,
  rust:       73,
  kotlin:     78,
  bash:       46,
};

class CodeController {

  // ── POST /api/code/run ──────────────────────────────────────────
  static async runCode(req, res) {
    try {
      const { language, source_code, stdin = '', file_id = null } = req.body;

      if (!language || !source_code) {
        return res.status(400).json({
          success: false,
          message: 'language and source_code are required.',
        });
      }

      const langConfig = LANGUAGES[language];
      if (!langConfig) {
        return res.status(400).json({
          success: false,
          message: `Unsupported language: "${language}"`,
          supported: Object.keys(LANGUAGES),
        });
      }

      // Preview-only languages (HTML/CSS) should not reach backend
      if (langConfig.executionEngine === 'preview') {
        return res.status(400).json({
          success: false,
          message: `${langConfig.name} is rendered as a preview on the frontend.`,
        });
      }

      const languageId = JUDGE0_LANG_IDS[language];
      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Judge0 language ID not found for: "${language}"`,
        });
      }

      const startTime = Date.now();

      // Submit to Judge0 CE (with retry on network errors)
      const token = await CodeController.submitCode(languageId, source_code, stdin);

      // Poll for result
      const result = await CodeController.pollResult(token);

      const executionTime = Date.now() - startTime;

      // Decode base64 outputs
      const stdout = CodeController.decode(result.stdout);
      const stderr = CodeController.decode(result.stderr);
      const compileOutput = CodeController.decode(result.compile_output);
      const exitCode = result.exit_code ?? 0;

      const errorOutput = [compileOutput, stderr].filter(Boolean).join('\n').trim();

      ExecutionModel.saveExecution({
        user_id: req.user.id,
        file_id,
        language,
        source_code,
        stdin,
        stdout,
        stderr: errorOutput,
        exit_code: exitCode,
        execution_time: executionTime,
        status: result.status?.id === 3 ? 'completed' : 'error',
      }).catch(() => {});

      return res.json({
        success:        true,
        output:         stdout,
        error:          errorOutput,
        exit_code:      exitCode,
        execution_time: executionTime,
        language:       langConfig.name,
        status:         result.status?.description || 'Completed',
        memory:         result.memory,
        time:           result.time,
      });

    } catch (error) {
      console.error('Code execution error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Code execution failed. Please try again.',
      });
    }
  }

  // ── Submit code to Judge0, returns token ─────────────────────────
  // Retries up to 3 times on network errors (ENOTFOUND, ECONNREFUSED, etc.)
  static async submitCode(languageId, sourceCode, stdin, attempt = 1) {
    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

    const payload = {
      language_id:    languageId,
      source_code:    Buffer.from(sourceCode).toString('base64'),
      stdin:          Buffer.from(stdin || '').toString('base64'),
      base64_encoded: true,
    };

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key']  = process.env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    try {
      const response = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
        payload,
        { headers, timeout: 10000 }
      );

      if (!response.data?.token) {
        throw new Error('Judge0 did not return a submission token.');
      }

      return response.data.token;
    } catch (err) {
      const isNetworkErr = err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
      if (isNetworkErr && attempt < 3) {
        console.warn(`Judge0 submit attempt ${attempt} failed (${err.code}), retrying...`);
        await CodeController.sleep(1000 * attempt);
        return CodeController.submitCode(languageId, sourceCode, stdin, attempt + 1);
      }
      throw err;
    }
  }

  // ── Poll Judge0 until result is ready ────────────────────────────
  static async pollResult(token, maxAttempts = 20) {
    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

    const headers = {};
    if (process.env.JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key']  = process.env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const delay = Math.min(800 + (attempt - 1) * 200, 2500);
      await CodeController.sleep(delay);

      const response = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,status,exit_code,memory,time`,
        { headers, timeout: 15000 }
      );

      const data = response.data;
      const statusId = data.status?.id;

      console.log(`  Poll ${attempt}/${maxAttempts} — status ${statusId} (${data.status?.description})`);

      // 1=In Queue, 2=Processing → keep polling; 3+=done
      if (statusId && statusId >= 3) {
        return data;
      }
    }

    throw new Error('Execution timed out after 20 attempts. Please try again.');
  }

  // ── Decode base64 safely ─────────────────────────────────────────
  static decode(b64) {
    if (!b64) return '';
    try {
      return Buffer.from(b64, 'base64').toString('utf-8');
    } catch {
      return b64;
    }
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── GET /api/code/health ─────────────────────────────────────────
  static async health(req, res) {
    return res.json({ success: true, status: 'online' });
  }

  // ── GET /api/code/languages ──────────────────────────────────────
  static async getLanguages(req, res) {
    const langs = Object.values(LANGUAGES).map(l => ({
      id:       l.id,
      name:     l.name,
      extension: l.extension,
      icon:     l.icon,
      color:    l.color,
      judge0Id: JUDGE0_LANG_IDS[l.id] || null,
    }));
    return res.json({ success: true, languages: langs });
  }

  // ── GET /api/code/languages/:id/default ─────────────────────────
  static async getDefaultCode(req, res) {
    const lang = LANGUAGES[req.params.id];
    if (!lang) {
      return res.status(404).json({ success: false, message: 'Language not found' });
    }
    return res.json({ success: true, code: lang.defaultCode, language: lang.name });
  }

  // ── GET /api/code/stats ──────────────────────────────────────────
  static async getStats(req, res) {
    try {
      const stats = await ExecutionModel.getStats(req.user.id);
      return res.json({ success: true, stats });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CodeController;
