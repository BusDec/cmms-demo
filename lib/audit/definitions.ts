export const DEFINITIONS = [
  {
    term: "Active technical object",
    detail:
      "Not deletion-flagged (LVORM / LOEKZ) and without system status DLFL or INAC.",
  },
  {
    term: "Open notification",
    detail:
      "System status neither NOCO nor CLSD; the notification still requires work.",
  },
  {
    term: "Released order",
    detail: "Status REL, and not TECO or CLSD.",
  },
  {
    term: "Overdue order",
    detail:
      "Basic finish (GLTRP) before the audit date and not technically complete.",
  },
  {
    term: "Class A equipment",
    detail:
      "ABC indicator A on EQUI / ILOA. The critical-asset checks use this population.",
  },
  {
    term: "Evaluated check",
    detail:
      "A check with a non-zero source population. A missing table or empty population is N/A, never a pass.",
  },
  {
    term: "Exception %",
    detail:
      "Failing records divided by the evaluated population for that check. The threshold is the maximum acceptable share.",
  },
];

export const SCORE_RULES = [
  {
    title: "Readiness",
    detail:
      "Passed checks divided by evaluated checks. N/A checks are excluded from both sides.",
  },
  {
    title: "Risk index",
    detail:
      "Severity-weighted failures: Critical 5, High 3, Medium 1. Zero is a clean system; 100 is every evaluated check failed.",
  },
  {
    title: "Audit opinion",
    detail:
      "Green at 85% readiness with no critical gaps. Amber at 70% with at most two. Everything else is Red.",
  },
];
