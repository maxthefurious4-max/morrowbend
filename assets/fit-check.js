(() => {
  const form = document.querySelector('#fit-form');
  const resultEl = document.querySelector('#fit-score');
  const title = document.querySelector('#fit-title');
  const detail = document.querySelector('#fit-detail');
  const copy = document.querySelector('#copy-result');
  const bands = {
    0: ['Not ready', 'Map it before you build it', 'The workflow is too infrequent, unclear, broad, risky, or ownerless for this sprint. Keep it human and clarify the process first.'],
    40: ['Investigate', 'Narrow the scope first', 'There is a plausible workflow here, but scope, ownership, or measurement needs tightening before a build. Focus on one trigger and one approved output.'],
    70: ['Strong fit', 'Worth a scoped conversation', 'This looks frequent, bounded, measurable, and safe enough for human-reviewed automation. It is the kind of workflow Morrowbend is built to test.']
  };
  let summary = '';

  function update() {
    const values = Object.fromEntries(new FormData(form).entries());
    const answered = Object.keys(values).length;
    const numbers = Object.values(values).map(Number);
    const total = numbers.reduce((a, b) => a + b, 0);
    const score = answered ? Math.round(total / (answered * 3) * 100) : 0;
    const hardStop = ['frequency', 'trigger', 'output', 'risk', 'owner']
      .some(name => Number(values[name]) === 0);
    const measurementMissing = Number(values.measure) === 0;
    const band = hardStop ? 0 : measurementMissing ? 40 : score >= 70 ? 70 : score >= 40 ? 40 : 0;

    resultEl.textContent = answered === 6 ? bands[band][0] : 'Pending';
    title.textContent = answered === 6 ? bands[band][1] : `${answered} of 6 answered`;
    detail.textContent = answered === 6
      ? bands[band][2]
      : 'Your answers stay in this browser. Nothing is uploaded or stored.';
    summary = `Morrowbend workflow fit check: ${bands[band][0]}. I want to discuss one workflow with a clear trigger, human-approved output, and measurable baseline.`;
    copy.disabled = answered < 6;
    copy.textContent = answered < 6 ? `Answer ${6 - answered} more` : 'Copy result';
  }

  form?.addEventListener('change', update);
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary);
      window.showToast?.('Result copied — paste it into your email or DM');
    } catch {
      window.showToast?.('Copy failed — select your result manually');
    }
  });
  update();
})();
