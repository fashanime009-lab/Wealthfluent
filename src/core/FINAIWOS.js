import { addHistory } from "../utils/history";

class FINAIWOS {
  saveCalculation({
    calculator,
    inputs,
    results,
    summary,
  }) {
    const payload = {
      calculator,
      inputs,
      results,
      summary,
      createdAt: Date.now(),
    };

    addHistory(payload);

    return payload;
  }

  getVersion() {
    return "1.0.0";
  }
}

export default new FINAIWOS();