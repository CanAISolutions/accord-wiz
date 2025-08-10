import { useAchievements } from "./useAchievements";

export function BadgeDisplay() {
  const { achievements } = useAchievements();
  if (!achievements.length) return null;
  return (
    <div className="hidden sm:flex items-center gap-2" aria-label="Achievements">
      {achievements.includes("jurisdiction") && <span title="Province Selected">🏅</span>}
      {achievements.includes("termsValid") && <span title="Terms Compliant">✅</span>}
      {achievements.includes("finished") && <span title="Agreement Completed">🎉</span>}
    </div>
  );
}

export default BadgeDisplay;


