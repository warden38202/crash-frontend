"use client";

import { useState } from 'react';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useGameStore, GameState } from '../store/gameStore';

import { getButtonText } from '../lib/utils';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { currencies } from '../lib/currencies';

import CurrencyList from './CurrencyList';

import styles from '../styles/components/GameControls.module.css';

const balances: Record<string, string> = {
	'eth': '0.05',
	'btc': '0.01',
};

export default function GameControls() {
	const [betAmount, setBetAmount] = useState<string>('0');
	const [autoCashOut, setAutoCashOut] = useState<string>('0');
	const [currency, setCurrency] = useState<string>(currencies[0].id);

	const hasBet = useGameStore((game: GameState) => game.hasBet);
	const gameStatus = useGameStore((game: GameState) => game.status);
	const isConnected = useGameStore((game: GameState) => game.isConnected);

	const { placeBet } = useGameStore((game: GameState) => game.actions);

	const haveValidBet = /^[0-9]+(\.?[0-9])*$/.test(betAmount) && parseFloat(betAmount);

	const buttonText = getButtonText(gameStatus, hasBet, isConnected);

	const handleChangeBetAmount = (amount: string) => {
		setBetAmount(amount);
	}

	const handleChangeAutoCashOut = (amount: string) => {
		setAutoCashOut(amount);
	}

	const handleButtonClick = () => {
		placeBet(betAmount, autoCashOut, currency);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Place your bets!</CardTitle>
			</CardHeader>

			<CardContent>
				<Input
					placeholder="Bet amount"
					type="number"
					min="0"
					onChange={(e) => handleChangeBetAmount(e.target.value)}
					value={betAmount}
				/>
				<Input
					placeholder="Auto cashout"
					type="number"
					min="0"
					step="0.01"
					onChange={(e) => handleChangeAutoCashOut(e.target.value)}
					value={autoCashOut}
				/>
				<CurrencyList balances={balances} />
			</CardContent>

			<CardFooter>
				<Button
					onClick={handleButtonClick}
					disabled={!haveValidBet || !isConnected}
					className={styles.BetButton}
				>
					{buttonText}
				</Button>
			</CardFooter>
		</Card>
	);
}
