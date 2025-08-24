"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '~/lib/Icon';
import { useThemeStore } from '../../store/theme-store';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { parseCoolorsUrl } from '../../src/utils/export-utils';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

// Helper to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const SortableColorItem = ({ color, index, onToggleLock, onColorChange, onCopyColor, onRemoveColor }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: color });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex flex-col items-center justify-center flex-1 h-full" >
      <motion.div
        className="flex flex-col items-center justify-center flex-1 h-full w-full"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4 p-4 bg-black/20 rounded-lg">
          <h2 className="text-2xl font-bold text-white">{color}</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => onToggleLock(index)}
              className={`p-2 rounded-full ${useThemeStore.getState().lockedColors[index] ? 'bg-white/50' : 'bg-white/20'} hover:bg-white/40 transition-colors`}
            >
              <Icon name={useThemeStore.getState().lockedColors[index] ? 'lock' : 'unlock'} className="text-white" />
            </Button>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value, index)}
              className="w-10 h-10 border-none cursor-pointer"
            />
            <Button
              onClick={() => onCopyColor(color)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            >
              <Icon name="copy" className="text-white" />
            </Button>
            <Button
              onClick={() => onRemoveColor(index)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            >
              <Icon name="trash" className="text-white" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const CoolorsPaletteGenerator = () => {
  const {
    currentPaletteColors,
    setCurrentPaletteColors,
    lockedColors,
    setLockedColors,
  } = useThemeStore();

  const [coolorsUrl, setCoolorsUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generatePalette = useCallback(() => {
    const newPalette = currentPaletteColors.map((color, index) => {
      return lockedColors[index] ? color : getRandomColor();
    });
    setCurrentPaletteColors(newPalette);
  }, [currentPaletteColors, lockedColors, setCurrentPaletteColors]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        generatePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [generatePalette]);

  const handleToggleLock = (index: number) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
  };

  const handleColorChange = (newColor: string, index: number) => {
    const newPalette = [...currentPaletteColors];
    newPalette[index] = newColor;
    setCurrentPaletteColors(newPalette);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  const handleRemoveColor = (index: number) => {
    const newPalette = [...currentPaletteColors];
    newPalette.splice(index, 1);
    setCurrentPaletteColors(newPalette);
  };

  const handleAddColor = () => {
    const newPalette = [...currentPaletteColors, getRandomColor()];
    setCurrentPaletteColors(newPalette);
  };

  const handleCoolorsUrlImport = () => {
    const colors = parseCoolorsUrl(coolorsUrl);
    if (colors) {
      setCurrentPaletteColors(colors);
      setLockedColors(new Array(colors.length).fill(false));
      toast.success('Palette imported from Coolors!');
    } else {
      toast.error('Invalid Coolors URL.');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = currentPaletteColors.findIndex((c) => c === active.id);
      const newIndex = currentPaletteColors.findIndex((c) => c === over.id);
      const newColors = arrayMove(currentPaletteColors, oldIndex, newIndex);
      setCurrentPaletteColors(newColors);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={currentPaletteColors} strategy={rectSortingStrategy}>
        <div className="flex flex-1 w-full">
          {currentPaletteColors.map((color, index) => (
            <SortableColorItem
              key={color}
              color={color}
              index={index}
              onToggleLock={handleToggleLock}
              onColorChange={handleColorChange}
              onCopyColor={handleCopyColor}
              onRemoveColor={handleRemoveColor}
            />
          ))}
          <div className="flex flex-col items-center justify-center flex-1 h-full bg-gray-200">
            <Button onClick={handleAddColor} className="p-4 rounded-full bg-white/50 hover:bg-white/70 transition-colors">
              <Icon name="add" className="text-black" />
            </Button>
          </div>
        </div>
      </SortableContext>
      <div className="p-4 flex gap-2">
        <Input
          type="text"
          placeholder="Paste Coolors URL..."
          value={coolorsUrl}
          onChange={(e) => setCoolorsUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleCoolorsUrlImport}>Import</Button>
      </div>
    </DndContext>
  );
};
