import { getCompositionProfile } from "../domain/compositionProfiles";
import type { CompositionProfileId } from "../domain/types";

interface ProfileBadgeProps {
  profileId: CompositionProfileId;
}

export function ProfileBadge({ profileId }: ProfileBadgeProps) {
  const profile = getCompositionProfile(profileId);

  return <span className={`profile-badge ${profile.className}`}>{profile.shortLabel}</span>;
}
