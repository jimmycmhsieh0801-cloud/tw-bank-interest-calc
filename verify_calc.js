const assert = require("assert");
const { calcBankInterests } = require("./app.js");

// 1. 舊戶存 30 萬：Richart 30萬 @ 1.8% = 5400/年, NewNewBank 30萬 @ 3% = 9000/年
const oldRes = calcBankInterests(300000, false);
const nnb = oldRes.find((x) => x.id === "newnewbank");
assert.strictEqual(nnb.annualInterest, 9000);
assert.strictEqual(nnb.monthlyInterest, 750);

// 2. 新戶存 30 萬：Richart 30萬 @ 3.5% = 10500/年
const newRes = calcBankInterests(300000, true);
const rich = newRes.find((x) => x.id === "richart");
assert.strictEqual(rich.annualInterest, 10500);

console.log("BANK_INTEREST_TESTS_PASSED");
