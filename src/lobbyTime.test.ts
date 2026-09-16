import {describe,expect,it} from 'vitest';
import {lobbyAssetId,lobbyPeriodAt} from './lobbyTime';

describe('local lobby time',()=>{
 it('uses daytime from 07:00 through 18:59 in the device time zone',()=>{
  expect(lobbyPeriodAt(new Date(2026,8,16,7,0))).toBe('day');
  expect(lobbyPeriodAt(new Date(2026,8,16,18,59))).toBe('day');
 });
 it('uses nighttime before 07:00 and from 19:00',()=>{
  expect(lobbyPeriodAt(new Date(2026,8,16,6,59))).toBe('night');
  expect(lobbyPeriodAt(new Date(2026,8,16,19,0))).toBe('night');
 });
 it('maps each period to its approved artwork',()=>{
  expect(lobbyAssetId('day')).toBe('world.lobby-day-approved');
  expect(lobbyAssetId('night')).toBe('world.lobby-night-approved');
 });
});
