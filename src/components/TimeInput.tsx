import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Slider, Box } from '@mui/material';
import styled from 'styled-components';

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

interface TimeInputProps {
    seconds: number;
    setSeconds: (value: number) => void;
    minutes: number;
    setMinutes: (value: number) => void;
    isRunning: boolean;
}

const TimeInput = React.memo(({ seconds, setSeconds, minutes, setMinutes, isRunning }: TimeInputProps) => {
    const [sliderValue, setSliderValue] = useState(seconds);

    useEffect(() => {
        setSliderValue(seconds);
    }, [seconds]);

    const handleSliderChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            if (typeof newValue === 'number') {
                setSeconds(newValue);
            }
        },
        [setSeconds]
    );

    const handleMinutesChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(Number(e.target.value), 720);
            setMinutes(value);
        },
        [setMinutes]
    );

    const handleSecondsChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSeconds(Number(e.target.value));
        },
        [setSeconds]
    );

    return (
        <Container>
            <TextField
                placeholder='Minutes'
                value={minutes}
                onChange={handleMinutesChange}
                inputProps={{ max: 720, 'data-type': 'minutes' }}
                sx={{ m: 1, width: '25ch', textAlign: 'center' }}
                disabled={isRunning}
            />
            <TextField
                datatype='seconds'
                value={seconds}
                placeholder='Seconds'
                inputProps={{ 'data-type': 'seconds' }}
                onChange={handleSecondsChange}
                sx={{ m: 1, width: '25ch' }}
                disabled={isRunning}
            />
            <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                step={15}
                min={0}
                max={60}
                sx={{ m: 2 }}
                disabled={isRunning}
            />
        </Container>
    );
});

export default TimeInput;
