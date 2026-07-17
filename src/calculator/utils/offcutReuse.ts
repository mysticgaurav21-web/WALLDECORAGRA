export interface OffcutPiece {
  id: string;
  width: number; // in feet
  height: number; // in feet
  sourceWall: string;
}

/**
 * Checks if a leftover offcut piece is suitable to be reused in another wall or row.
 * Returns true if the offcut's dimensions equal or exceed the required dimensions.
 */
export function isOffcutReusable(
  offcut: OffcutPiece,
  reqWidth: number,
  reqHeight: number
): boolean {
  return offcut.width >= reqWidth && offcut.height >= reqHeight;
}

/**
 * Returns user-facing advice on how offcuts are reused during actual site work.
 */
export function getOffcutReuseNote(): string {
  return "Actual offcut reuse depends on design direction, colour consistency, joints and installer approval.";
}
