/**
 * 2026-11 台灣數位帳戶高利活存利率與額度上限資料庫
 */
const BANKS_2026 = [
  {
    id: "newnewbank",
    name: "聯邦 New New Bank",
    newRate: 10.0,
    newCap: 150000,
    oldRate: 3.0,
    oldCap: 400000,
    baseRate: 0.705,
    note: "新戶 10% 限開戶首期約1個月(15萬內)；舊戶解任務享金級 3%(40萬內)"
  },
  {
    id: "obank",
    name: "王道銀行 O-Bank",
    newRate: 12.0,
    newCap: 100000,
    oldRate: 2.1,
    oldCap: 100000,
    baseRate: 0.705,
    note: "新戶首月 12%(10萬內)，第2個月起或專案約 2.1%"
  },
  {
    id: "richart",
    name: "台新 Richart",
    newRate: 3.5,
    newCap: 300000,
    oldRate: 1.8,
    oldCap: 300000,
    baseRate: 0.705,
    note: "新戶優利子帳戶 3.5%(30萬內，~2027/04/01)；舊戶好朋友約 1.8%"
  },
  {
    id: "sny",
    name: "華南銀行 SnY",
    newRate: 2.3,
    newCap: 100000,
    oldRate: 2.3,
    oldCap: 100000,
    baseRate: 0.705,
    note: "不分新舊戶完成任務享 2.3%(10萬內)"
  },
  {
    id: "ileo",
    name: "第一銀行 iLEO",
    newRate: 2.0,
    newCap: 120000,
    oldRate: 2.0,
    oldCap: 120000,
    baseRate: 0.705,
    note: "免解任務即享 2.0%(12萬內)"
  },
  {
    id: "nextbank",
    name: "將來銀行 NEXT BANK",
    newRate: 1.85,
    newCap: 1000000,
    oldRate: 1.85,
    oldCap: 1000000,
    baseRate: 1.6,
    note: "5萬～100萬享 1.85%(5選1任務)，100萬以上 1.6%"
  },
  {
    id: "dawho",
    name: "永豐銀行 大戶 DAWHO",
    newRate: 1.5,
    newCap: 300000,
    oldRate: 1.5,
    oldCap: 300000,
    baseRate: 0.705,
    note: "大戶等級 30 萬內 1.5%(新戶至次月底直接享大戶；跨轉提每月20次免費)"
  },
  {
    id: "linebank",
    name: "LINE Bank 口袋帳戶",
    newRate: 1.5,
    newCap: 1000000,
    oldRate: 1.5,
    oldCap: 1000000,
    baseRate: 0.705,
    note: "口袋帳戶 1.5%(額度上限 100 萬)"
  }
];

function calcBankInterests(depositAmount, isNewUser = false) {
  const amt = Math.max(0, Number(depositAmount) || 0);
  const results = BANKS_2026.map((b) => {
    const rate = isNewUser ? b.newRate : b.oldRate;
    const cap = isNewUser ? b.newCap : b.oldCap;
    const highPart = Math.min(amt, cap);
    const lowPart = Math.max(0, amt - cap);
    const annualInterest = Math.round(highPart * (rate / 100) + lowPart * (b.baseRate / 100));
    const monthlyInterest = Math.round(annualInterest / 12);
    const effectiveRate = amt > 0 ? Math.round((annualInterest / amt) * 10000) / 100 : 0;

    return {
      id: b.id,
      name: b.name,
      rate,
      cap,
      annualInterest,
      monthlyInterest,
      effectiveRate,
      note: b.note
    };
  });

  results.sort((a, b) => b.annualInterest - a.annualInterest);
  return results;
}

if (typeof document !== "undefined") {
  const depInput = document.getElementById("depositInput");
  const modeSelect = document.getElementById("userModeSelect");
  const tbody = document.querySelector("#bankTable tbody");

  function render() {
    const amt = Number(depInput.value) || 0;
    const isNew = modeSelect.value === "new";
    const rows = calcBankInterests(amt, isNew);
    const best = rows[0];

    document.getElementById("bestBankEl").textContent = best ? best.name : "--";
    document.getElementById("bestMonthEl").textContent = best ? `NT$ ${best.monthlyInterest.toLocaleString()} / 月` : "--";
    document.getElementById("bestYearEl").textContent = best ? `NT$ ${best.annualInterest.toLocaleString()} / 年 (${best.effectiveRate}%)` : "--";

    tbody.innerHTML = rows
      .map(
        (r) => `
      <tr>
        <td><strong>${r.name}</strong><br><small style="color:#64748b">${r.note}</small></td>
        <td>${r.rate}%</td>
        <td>${(r.cap / 10000).toLocaleString()} 萬</td>
        <td><strong>NT$ ${r.monthlyInterest.toLocaleString()}</strong></td>
        <td>NT$ ${r.annualInterest.toLocaleString()} (${r.effectiveRate}%)</td>
      </tr>`
      )
      .join("");
  }

  document.querySelectorAll("#depPresets .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      depInput.value = chip.dataset.amt;
  const copyBtn = document.getElementById("copyResultBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const amt = Number(depInput.value) || 0;
      const mode = modeSelect.value === "new" ? "全新戶" : "一般/舊戶";
      const rows = calcBankInterests(amt, modeSelect.value);
      const best = rows[0];
      const summary = best
        ? `【2026 台灣高利活存試算】\n存入 NT$${amt.toLocaleString()}（${mode}）\n最優銀行：${best.name}（${best.rate}%）\n預估月息：NT$${best.monthlyInterest.toLocaleString()}｜年息：NT$${best.annualInterest.toLocaleString()}（實質 ${best.effectiveRate}%）\n👉 免費試算：https://jimmycmhsieh0801-cloud.github.io/tw-bank-interest-calc/`
        : "https://jimmycmhsieh0801-cloud.github.io/tw-bank-interest-calc/";
      const done = () => {
        copyBtn.textContent = "✓ 已複製試算摘要，快去貼上分享！";
        setTimeout(() => { copyBtn.textContent = "📋 一鍵複製試算結果分享（貼到 Line 群 / Threads 討論）"; }, 2200);
        if (typeof gtag === "function") gtag("event", "share_result_copy", { tool: "tw-bank-interest-calc" });
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).then(done).catch(() => {});
      }
    });
  }

      render();
    });
  });

  [depInput, modeSelect].forEach((el) => el.addEventListener("input", render));
  render();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calcBankInterests };
}
