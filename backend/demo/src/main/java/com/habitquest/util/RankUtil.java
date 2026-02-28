package com.habitquest.util;

public final class RankUtil {

    private RankUtil() {}

    public static String getRankForXP(int xp) {
        if (xp >= 3000) return "Diamond";
        if (xp >= 1000) return "Gold";
        return "Bronze";
    }

    public static int getXPForNextRank(int xp) {
        if (xp >= 3000) return 3000; // Max rank
        if (xp >= 1000) return 3000;
        return 1000;
    }

    public static int getXPForCurrentRank(int xp) {
        if (xp >= 3000) return 3000;
        if (xp >= 1000) return 1000;
        return 0;
    }

    public static int getXPProgress(int xp) {
        if (xp >= 3000) return 100;
        if (xp >= 1000) {
            int rangeStart = 1000;
            int rangeEnd = 3000;
            int progress = (xp - rangeStart) * 100 / (rangeEnd - rangeStart);
            return Math.min(100, progress);
        }
        return xp * 100 / 1000;
    }

    public static boolean didRankUp(int oldXP, int newXP) {
        String oldRank = getRankForXP(oldXP);
        String newRank = getRankForXP(newXP);
        return !oldRank.equals(newRank);
    }
}
