"use client";

import { useRef, useState, useCallback } from "react";
import type { BuildingRoom } from "@/types";

const STATUS_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  available: { fill: "#dcfce7", stroke: "#16a34a", label: "Beschikbaar" },
  reserved:  { fill: "#fef9c3", stroke: "#ca8a04", label: "Gereserveerd" },
  rented:    { fill: "#fee2e2", stroke: "#dc2626", label: "Verhuurd" },
  hidden:    { fill: "#f3f4f6", stroke: "#9ca3af", label: "Verborgen" },
};

interface Props {
  rooms: BuildingRoom[];
  selectedRoomId?: string | null;
  onRoomClick: (room: BuildingRoom) => void;
  onRoomMove?: (id: string, x: number, y: number) => void;
}

export function FloorPlanSvg({ rooms, selectedRoomId, onRoomClick, onRoomMove }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});

  const getPos = (room: BuildingRoom) => ({
    x: localPositions[room.id]?.x ?? room.pos_x,
    y: localPositions[room.id]?.y ?? room.pos_y,
  });

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, room: BuildingRoom) => {
    if (!onRoomMove) return;
    e.preventDefault();
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    setDragging({ id: room.id, startX: x, startY: y, origX: getPos(room).x, origY: getPos(room).y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    const dx = x - dragging.startX;
    const dy = y - dragging.startY;
    setLocalPositions((prev) => ({
      ...prev,
      [dragging.id]: { x: dragging.origX + dx, y: dragging.origY + dy },
    }));
  };

  const handleMouseUp = () => {
    if (!dragging || !onRoomMove) return;
    const pos = localPositions[dragging.id];
    if (pos) {
      onRoomMove(dragging.id, Math.round(pos.x), Math.round(pos.y));
    }
    setDragging(null);
  };

  // Compute viewBox based on room positions
  const allX = rooms.map((r) => getPos(r).x);
  const allY = rooms.map((r) => getPos(r).y);
  const allW = rooms.map((r) => r.width);
  const allH = rooms.map((r) => r.height);
  const minX = Math.min(0, ...allX) - 20;
  const minY = Math.min(0, ...allY) - 20;
  const maxX = Math.max(750, ...allX.map((x, i) => x + allW[i])) + 20;
  const maxY = Math.max(400, ...allY.map((y, i) => y + allH[i])) + 20;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  return (
    <div className="w-full overflow-auto rounded-xl border border-gray-200 bg-gray-50">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-3 border-b border-gray-200 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, { fill, stroke, label }]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded border"
              style={{ background: fill, borderColor: stroke }}
            />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full"
        style={{ minHeight: 300, cursor: dragging ? "grabbing" : "default" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="#f8fafc" />

        {rooms.length === 0 && (
          <text x={(minX + maxX) / 2} y={(minY + maxY) / 2} textAnchor="middle" fill="#9ca3af" fontSize="14">
            Geen kamers op deze verdieping. Klik &quot;Kamer toevoegen&quot;.
          </text>
        )}

        {rooms.map((room) => {
          const { x, y } = getPos(room);
          const color = STATUS_COLORS[room.availability_status] ?? STATUS_COLORS.available;
          const isSelected = room.id === selectedRoomId;
          const isDraggingThis = dragging?.id === room.id;

          return (
            <g
              key={room.id}
              style={{ cursor: onRoomMove ? "grab" : "pointer" }}
              onClick={() => !isDraggingThis && onRoomClick(room)}
              onMouseDown={(e) => handleMouseDown(e, room)}
            >
              <rect
                x={x}
                y={y}
                width={room.width}
                height={room.height}
                rx={4}
                fill={color.fill}
                stroke={isSelected ? "#2563eb" : color.stroke}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isDraggingThis ? 0.75 : 1}
              />
              {/* Room label */}
              <text
                x={x + room.width / 2}
                y={y + room.height / 2 - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={isSelected ? "#1d4ed8" : "#374151"}
              >
                {room.room_label}
              </text>
              {/* Size sub-label */}
              {room.size_m2 && (
                <text
                  x={x + room.width / 2}
                  y={y + room.height / 2 + 9}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6b7280"
                >
                  {room.size_m2}m²
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
