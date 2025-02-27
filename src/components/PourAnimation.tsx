import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Lottie from 'react-lottie-player';
import pourAnimationData from '@/assets/lottie/pouring.json';

interface PourAnimationProps {
  isVisible: boolean;
  currentWaterAmount: number;
  targetWaterAmount: number;
}

const PourAnimation: React.FC<PourAnimationProps> = ({
  isVisible,
  currentWaterAmount,
  targetWaterAmount,
}) => {
  const [waterAmount, setWaterAmount] = useState(currentWaterAmount);
  const animationDuration = 3000; // 全体のアニメーション時間: 3秒間
  const delayBeforeCount = 500; // カウントアップ開始までの遅延: 0.5秒
  const countDuration = 1000; // カウントアップにかかる時間: 1秒
  
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // アニメーション開始時に呼び出される
  useEffect(() => {
    if (isVisible) {
      // 初期値を設定
      setWaterAmount(currentWaterAmount);
      
      // 現在時間を記録
      startTimeRef.current = Date.now();
      
      // アニメーションフレームを開始
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        
        // 0.5秒間は現在の値を表示
        if (elapsed < delayBeforeCount) {
          setWaterAmount(currentWaterAmount);
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        
        // 0.5秒～1.5秒の間でカウントアップ
        const countElapsed = elapsed - delayBeforeCount;
        if (countElapsed < countDuration) {
          const progress = countElapsed / countDuration;
          const newWaterAmount = currentWaterAmount + (targetWaterAmount - currentWaterAmount) * progress;
          setWaterAmount(Math.round(newWaterAmount));
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        
        // 1.5秒以降は目標値を表示
        setWaterAmount(targetWaterAmount);
        
        // アニメーションが完了したらフレーム要求をキャンセル
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
      
      // アニメーションを開始
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // 3秒後に自動的にアニメーションを終了するタイマーを設定
      animationTimerRef.current = setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setWaterAmount(targetWaterAmount);
      }, animationDuration);
    }
    
    // クリーンアップ
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible, currentWaterAmount, targetWaterAmount]);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: ({ palette }) => 
          palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 300
      }}
    >
      <Lottie
        loop={false}
        animationData={pourAnimationData}
        play={true}
        style={{ width: 200, height: 200 }}
      />
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
        {waterAmount} ml
      </Typography>
    </Box>
  );
};

export default PourAnimation;