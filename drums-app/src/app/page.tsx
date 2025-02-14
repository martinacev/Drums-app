"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import icon from "../../public/plus_icon.png";
import closeIcon from "../../public/close.png";

type DrumSlotData = {
  key: string;
  sound: string;
};

type SoundsMap = Record<string, string>;

const sounds: SoundsMap = {
  "Crash Cymbal": "/crash-cymbal.mp3",
  "Snare Drum": "/snare-drum.mp3",
  "Long Ride Cymbal": "/long-ride-cymbal.mp3",
  "Tom": "/tom.mp3",
  "Hi-Hat": "/hi-hat.mp3",
  "Floor Tom": "/floor-tom.mp3",
};

const StyledMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6.5em;
  align-items: center;
  padding: 6em 10em;
`;

const StyledGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1rem;
  width: 100%;
`;

const StyledHeader = styled.h1`
  color: white;
  width: 100%;
  font-weight: 400;
`;

const StyledDrumSlot = styled.div<{ assigned: boolean }>`
  background-color: ${({ assigned }) => (assigned ? "#1C1C1C" : "#2B2B2B")};
  border: 1px solid ${({ assigned }) => (assigned ? "#FFFFFF99" : "#ffffff33")};
  border-radius: 1em;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: ${({ assigned }) => (assigned ? "start" : "center")};
  align-items: ${({ assigned }) => (assigned ? "start" : "center")};
  font-size: 2em;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  padding: ${({ assigned }) => (assigned ? "1em" : "0")};
`;

type DrumSlotProps = {
  index: number;
  onClick: () => void;
  assignedKey: string;
};

const DrumSlot = ({ onClick, assignedKey }: DrumSlotProps) => (
  <StyledDrumSlot assigned={!!assignedKey} onClick={onClick}>
    {assignedKey || <Image src={icon} alt="Plus icon" />}
  </StyledDrumSlot>
);

type ModalProps = {
  index: number;
  onClose: () => void;
  onAssign: (index: number, key: string, sound: string) => void;
};

const Modal = ({ index, onClose, onAssign }: ModalProps) => {
  const [key, setKey] = useState("");
  const [sound, setSound] = useState("");

  const handleSubmit = () => {
    if (key && sound) {
      onAssign(index, key, sound);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <Image src={closeIcon} alt="Close icon" />
        </button>
        <div className="modal-main-container">
          <div className="styled-group">
            <p className="styled-label">Drum Sample</p>
            <select className="styled-dropdown" value={sound} onChange={(e) => setSound(e.target.value)}
              style={{
                backgroundColor: "gray",
                color: "white",
              }}>
              <option value="">Select Sound</option>
              {Object.keys(sounds).map((soundName) => (
                <option key={soundName} value={soundName}>
                  {soundName}
                </option>
              ))}
            </select>
          </div>
          <div className="styled-group">
            <p className="styled-label">Keyboard Shortcut</p>
            <input style={{
              backgroundColor: "black",
              color: "white",
            }} className="styled-input" type="text" placeholder="Press a key" value={key} onChange={(e) => setKey(e.target.value)} maxLength={1}

            />
          </div>
          <button className="styled-button" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [slots, setSlots] = useState<DrumSlotData[]>(Array(12).fill({ key: "", sound: "" }));

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const slot = slots.find((slot) => slot.key === event.key);
      if (slot && slot.sound) {
        const soundKey = slot.sound as keyof typeof sounds;
        new Audio(sounds[soundKey]).play();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [slots]);

  const handleAssign = (index: number, key: string, sound: string) => {
    const newSlots = [...slots];
    newSlots[index] = { key, sound };
    setSlots(newSlots);
    setSelectedSlot(null);
  };

  return (
    <StyledMainWrapper>
      <StyledHeader>Drum Machine</StyledHeader>
      <StyledGridWrapper>
        {slots.map((slot, i) => (
          <DrumSlot key={i} index={i} onClick={() => setSelectedSlot(i)} assignedKey={slot.key} />
        ))}
      </StyledGridWrapper>
      {selectedSlot !== null && <Modal index={selectedSlot} onClose={() => setSelectedSlot(null)} onAssign={handleAssign} />}
    </StyledMainWrapper>
  );
}
