import { useState, useEffect, useContext, createContext, useCallback } from "react";
import { playersApi, newsApi, achievementsApi, committeeApi, reviewsApi } from "@/lib/api";
import type { Review, NewsArticle, Achievement, Player, CommitteeMember } from "@/lib/api";

export type { Review, NewsArticle, Achievement, Player, CommitteeMember };

interface DataContextValue {
  version: number;
  refresh: () => void;
}

export const DataContext = createContext<DataContextValue>({ version: 0, refresh: () => {} });

export function useRefresh() {
  return useContext(DataContext).refresh;
}

function useApiData<T>(fetcher: () => Promise<T[]>): T[] {
  const { version } = useContext(DataContext);
  const [data, setData] = useState<T[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetcher().then(d => { if (!cancelled) setData(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, [version]);
  return data;
}

export function useReviews(): Review[] {
  return useApiData(reviewsApi.list);
}

export function useNews(): NewsArticle[] {
  return useApiData(newsApi.list);
}

export function useAchievements(): Achievement[] {
  return useApiData(achievementsApi.list);
}

export function useAchievementYears(): number[] {
  const achievements = useAchievements();
  return [...new Set(achievements.map(a => a.year))].sort((a, b) => b - a);
}

export function useAchievementsByYear(year: number): Achievement[] {
  const achievements = useAchievements();
  return achievements.filter(a => a.year === year);
}

export function useAchievementById(id: number | null) {
  const achievements = useAchievements();
  const players = usePlayers();
  if (!id) return null;
  const ach = achievements.find(a => a.id === id);
  if (!ach) return null;
  return { ...ach, taggedPlayers: players.filter(p => ach.taggedPlayerIds.includes(p.id)) };
}

export function usePlayers(search?: string): Player[] {
  const all = useApiData(playersApi.list);
  if (!search) return all;
  const lower = search.toLowerCase();
  return all.filter(p => p.name.toLowerCase().includes(lower) || p.district?.toLowerCase().includes(lower));
}

export function usePlayerById(id: number | null) {
  const players = usePlayers();
  const achievements = useAchievements();
  if (!id) return null;
  const player = players.find(p => p.id === id);
  if (!player) return null;
  return { ...player, achievements: achievements.filter(a => player.achievementIds?.includes(a.id)) };
}

export function useCommitteeMembers(): CommitteeMember[] {
  return useApiData(committeeApi.list);
}
