import { useState, useEffect, useRef } from 'react';
import Annotator from '../../lib/Annotator';

// TODO: make this work?
export default function useAnnotator(images: string[]): Annotator {
  const annotatorRef = useRef<Annotator>();

  if (!annotatorRef.current) {
    annotatorRef.current = new Annotator(images);
  }

  return annotatorRef.current;
}
