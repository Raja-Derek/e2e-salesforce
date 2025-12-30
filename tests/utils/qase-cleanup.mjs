import fetch from 'node-fetch';

const QASE_API = 'https://api.qase.io/v1';
const PROJECT = process.env.QASE_PROJECT_CODE;
const TOKEN = process.env.QASE_API_TOKEN;

async function cleanupRuns() {
  const res = await fetch(`${QASE_API}/run/${PROJECT}`, {
    headers: { Token: TOKEN },
  });

  const data = await res.json();
  const runs = data.result.entities;

  if (runs.length <= 2) return;

  const sorted = runs.sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  const toDelete = sorted.slice(0, runs.length - 2);

  for (const run of toDelete) {
    await fetch(`${QASE_API}/run/${PROJECT}/${run.id}`, {
      method: 'DELETE',
      headers: { Token: TOKEN },
    });
    console.log(`🗑️ Deleted run ${run.id}`);
  }
}

cleanupRuns();
