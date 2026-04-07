-- CreateIndex
CREATE INDEX "Game_sessionId_idx" ON "Game"("sessionId");

-- CreateIndex
CREATE INDEX "GameCategory_gameId_idx" ON "GameCategory"("gameId");

-- CreateIndex
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- CreateIndex
CREATE INDEX "Round_gameId_idx" ON "Round"("gameId");

-- CreateIndex
CREATE INDEX "Round_teamId_idx" ON "Round"("teamId");

-- CreateIndex
CREATE INDEX "RoundWord_roundId_idx" ON "RoundWord"("roundId");

-- CreateIndex
CREATE INDEX "RoundWord_wordId_idx" ON "RoundWord"("wordId");

-- CreateIndex
CREATE INDEX "Team_gameId_idx" ON "Team"("gameId");
