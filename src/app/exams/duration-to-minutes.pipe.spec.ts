import { DurationToMinutesPipe } from './duration-to-minutes.pipe';

describe('DurationToMinutesPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationToMinutesPipe();
    expect(pipe).toBeTruthy();
  });
});
