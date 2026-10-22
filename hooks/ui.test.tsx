import { expect, test } from 'claude-code/testing'

test('o círculo do cache desenha no rodapé do desktop', async $ => {
  const ui = await $.ui.mount({
    plugin: 'session-stats',
    surface: 'desktop',
    component: 'SessionMode',
    props: { modes: [] },
  })
  const badge = await ui.find({ key: 'cache-badge' })
  expect(badge).toBeDefined()
  expect(badge?.text).toContain('cache')
  await ui.unmount()
})

test('clicar no tempo do círculo abre o cartão acima do prompt', async $ => {
  const footer = await $.ui.mount({
    plugin: 'session-stats',
    surface: 'desktop',
    component: 'SessionMode',
    props: { modes: [] },
  })
  expect(await footer.find({ type: 'Text', text: '◯' })).toBeDefined()
  await footer.press({ key: 'cache-badge' })

  const band = await $.ui.mount({
    plugin: 'session-stats',
    surface: 'desktop',
    component: 'AbovePrompt',
    props: { hasSurvey: false, isWorking: false, maxRows: 20 } as never,
  })
  expect(await band.find({ key: 'card-sessao' })).toBeDefined()
  await band.press({ key: 'card-close' })

  await band.unmount()
  await footer.unmount()
})

test('enquanto Claude responde, o rodapé mostra só a bola amarela', async ($, on) => {
  // The engine beneath: a turn's start echoes its id, its end the answer.
  on('turn.start', async (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', async (_, e) => ({ text: e.answer }))
  const FOOTER = { plugin: 'session-stats', surface: 'desktop', component: 'SessionMode', props: { modes: [] } } as const

  await $.turn.start({ text: 'oi', turnId: 't1' })
  const busy = await $.ui.mount(FOOTER)
  expect(await busy.find({ type: 'Text', text: '⬤' })).toBeDefined()
  expect(await busy.find({ key: 'cache-badge' })).toBeUndefined()
  await busy.unmount()

  await $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  const after = await $.ui.mount(FOOTER)
  expect(await after.find({ key: 'cache-badge' })).toBeDefined()
  await after.unmount()
})
