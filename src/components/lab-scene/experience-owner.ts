export type ExpensiveExperienceKind = "scene" | "video" | "architecture";

export type ExpensiveExperienceToken = Readonly<{
  id: symbol;
  kind: ExpensiveExperienceKind;
}>;

export class ExpensiveExperienceOwner {
  private activeToken: ExpensiveExperienceToken | null = null;

  acquire(token: ExpensiveExperienceToken) {
    if (this.activeToken && this.activeToken !== token) return false;
    this.activeToken = token;
    return true;
  }

  release(token: ExpensiveExperienceToken) {
    if (this.activeToken === token) this.activeToken = null;
  }

  owns(token: ExpensiveExperienceToken) {
    return this.activeToken === token;
  }
}

export const expensiveExperienceOwner = new ExpensiveExperienceOwner();

export function createExpensiveExperienceToken(
  kind: ExpensiveExperienceKind,
): ExpensiveExperienceToken {
  return { id: Symbol(kind), kind };
}
