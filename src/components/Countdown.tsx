import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, LinearProgress, Box } from '@mui/material';
import styled from 'styled-components';
import TimeInput from './TimeInput';

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Countdown = React.memo(() => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [initialCountdown, setInitialCountdown] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [shouldPlaySound, setShouldPlaySound] = useState(false);
    const playSound = useCallback(() => {
        const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/timerAlarm.mp3`);
        audio.play();
    }, []);
    useEffect(() => {
        if (countdown === 0 && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setIsRunning(false);
            if (shouldPlaySound) {
                playSound();
            }
            setShouldPlaySound(false);
        }
    }, [countdown, intervalId, playSound, shouldPlaySound]);

    const startCountdown = useCallback(() => {
        const fullTime = seconds + minutes * 60;
        setCountdown(fullTime);
        setInitialCountdown(fullTime);

        const id = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        setIntervalId(id);
        setIsRunning(true);
        setShouldPlaySound(true);
    }, [minutes, seconds]);

    const resetCountdown = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        setCountdown(0);
        setMinutes(0);
        setSeconds(0);
        setInitialCountdown(0);
        setIsRunning(false);
        setShouldPlaySound(false);
    }, [intervalId]);

    const pauseCountdown = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setIsRunning(false);
        }
    }, [intervalId]);

    const progress = useMemo(() => {
        return initialCountdown ? ((initialCountdown - countdown) / initialCountdown) * 100 : 0;
    }, [countdown, initialCountdown]);

    return (
        <Container>
            <TimeInput
                seconds={seconds}
                minutes={minutes}
                setSeconds={setSeconds}
                setMinutes={setMinutes}
                isRunning={isRunning}
            />
            <Button
                sx={{ m: 1, width: '120px', height: '56px' }}
                variant='contained'
                onClick={isRunning ? pauseCountdown : startCountdown}
                disabled={isRunning && countdown === 0}
            >
                {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button sx={{ m: 1, width: '120px', height: '56px' }} variant='contained' onClick={resetCountdown}>
                Reset
            </Button>
            <Box sx={{ mt: 2, width: '100%' }}>
                <LinearProgress
                    variant='determinate'
                    value={progress}
                    sx={{
                        width: '250px',
                        margin: '0 auto',
                    }}
                />
                {countdown !== 0 && (
                    <div style={{ textAlign: 'center' }}>
                        {`${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(
                            Math.floor(countdown % 60)
                        ).padStart(2, '0')}`}
                    </div>
                )}
            </Box>
        </Container>
    );
});

export default Countdown;
