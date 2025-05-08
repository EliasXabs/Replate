/* ------------------------------------------------------------------ */
/*  services/aiService.ts                                             */
/* ------------------------------------------------------------------ */
export class AiService {
  private static baseUrl = 'http://localhost:8000'; // same server/port

  /**
   * POST /refine  { prompt }
   * returns { result }  or { error }
   */
  static async ask(prompt: string): Promise<string> {
    const res = await fetch(`${AiService.baseUrl}/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }
    const body = await res.json();
    if (body.error) {
      throw new Error(body.error);
    }
    return body.result as string;
  }
}
