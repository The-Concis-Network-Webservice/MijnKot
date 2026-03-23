"use client";

import { useState, useEffect } from "react";
import { useToast } from "./toast";
import type { BuildingFloor, BuildingRoom, Kot } from "@/types";

interface Props {
  vestigingId: string;
  koten: Kot[];
}

const STATUS_CONFIG = {
  available: { bg: "bg-green-100", border: "border-green-400", text: "text-green-800", dot: "bg-green-500", label: "Beschikbaar" },
  reserved:  { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-800", dot: "bg-yellow-400", label: "Gereserveerd" },
  rented:    { bg: "bg-red-100", border: "border-red-400", text: "text-red-800", dot: "bg-red-500", label: "Verhuurd" },
  hidden:    { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-400", dot: "bg-gray-300", label: "Verborgen" },
} as const;


export function FloorPlanManager({ vestigingId, koten }: Props) {
  const { push } = useToast();
  const [floors, setFloors] = useState<BuildingFloor[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<BuildingRoom | null>(null);
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [floorForm, setFloorForm] = useState({ floor_name: "", level: "1" });
  const [roomForm, setRoomForm] = useState({
    room_label: "",
    size_m2: "",
    availability_status: "available" as BuildingRoom["availability_status"],
    kot_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [addingRoomToFloor, setAddingRoomToFloor] = useState<string | null>(null);
  const [newRoomLabel, setNewRoomLabel] = useState("");

  const load = async () => {
    const res = await fetch(`/api/cms/floor-plans?vestiging_id=${vestigingId}`);
    if (!res.ok) return;
    const { data } = await res.json();
    setFloors(data ?? []);
  };

  useEffect(() => { load(); }, [vestigingId]);

  useEffect(() => {
    if (selectedRoom) {
      setRoomForm({
        room_label: selectedRoom.room_label,
        size_m2: selectedRoom.size_m2?.toString() ?? "",
        availability_status: selectedRoom.availability_status,
        kot_id: selectedRoom.kot_id ?? "",
      });
    }
  }, [selectedRoom]);

  const allRooms = floors.flatMap((f) => f.rooms ?? []);
  const counts = {
    total: allRooms.length,
    available: allRooms.filter((r) => r.availability_status === "available").length,
    reserved: allRooms.filter((r) => r.availability_status === "reserved").length,
    rented: allRooms.filter((r) => r.availability_status === "rented").length,
    hidden: allRooms.filter((r) => r.availability_status === "hidden").length,
  };

  const addFloor = async () => {
    if (!floorForm.floor_name) return;
    setSaving(true);
    const res = await fetch("/api/cms/floor-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vestiging_id: vestigingId,
        floor_name: floorForm.floor_name,
        level: parseInt(floorForm.level),
        order_index: parseInt(floorForm.level),
      }),
    });
    if (res.ok) {
      setFloorForm({ floor_name: "", level: "1" });
      setShowAddFloor(false);
      await load();
      push("Verdieping toegevoegd.");
    }
    setSaving(false);
  };

  const deleteFloor = async (id: string) => {
    if (!confirm("Verdieping en alle kamers verwijderen?")) return;
    await fetch("/api/cms/floor-plans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selectedRoom && floors.find((f) => f.id === id)?.rooms?.find((r) => r.id === selectedRoom.id)) {
      setSelectedRoom(null);
    }
    await load();
    push("Verdieping verwijderd.");
  };

  const addRoom = async (floorId: string, label: string) => {
    if (!label.trim()) return;
    setSaving(true);
    const floor = floors.find((f) => f.id === floorId);
    const existingCount = floor?.rooms?.length ?? 0;
    const res = await fetch("/api/cms/floor-rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        floor_id: floorId,
        room_label: label.trim(),
        pos_x: (existingCount % 8) * 110 + 10,
        pos_y: Math.floor(existingCount / 8) * 80 + 10,
        width: 100,
        height: 65,
        availability_status: "available",
      }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setAddingRoomToFloor(null);
      setNewRoomLabel("");
      await load();
      setSelectedRoom(data);
      push("Kamer toegevoegd.");
    }
    setSaving(false);
  };

  const saveRoom = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    const res = await fetch("/api/cms/floor-rooms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedRoom.id,
        room_label: roomForm.room_label,
        size_m2: roomForm.size_m2 ? parseFloat(roomForm.size_m2) : null,
        availability_status: roomForm.availability_status,
        kot_id: roomForm.kot_id || null,
      }),
    });
    if (res.ok) {
      await load();
      // Keep selection with updated data
      setSelectedRoom((prev) => prev ? { ...prev, ...roomForm, size_m2: roomForm.size_m2 ? parseFloat(roomForm.size_m2) : null, kot_id: roomForm.kot_id || null } : null);
      push("Opgeslagen.");
    }
    setSaving(false);
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Kamer verwijderen?")) return;
    await fetch("/api/cms/floor-rooms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSelectedRoom(null);
    await load();
    push("Kamer verwijderd.");
  };

  const quickToggle = async (room: BuildingRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    const cycle: Record<string, BuildingRoom["availability_status"]> = {
      available: "rented",
      rented: "available",
      reserved: "available",
      hidden: "available",
    };
    const next = cycle[room.availability_status];
    await fetch("/api/cms/floor-rooms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: room.id, availability_status: next }),
    });
    await load();
    if (selectedRoom?.id === room.id) {
      setSelectedRoom((prev) => prev ? { ...prev, availability_status: next } : null);
    }
  };

  if (floors.length === 0) {
    return (
      <div className="space-y-4">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors"
          onClick={() => setShowAddFloor(true)}
        >
          + Verdieping toevoegen
        </button>
        {showAddFloor && (
          <AddFloorForm
            form={floorForm}
            setForm={setFloorForm}
            onSave={addFloor}
            onCancel={() => setShowAddFloor(false)}
            saving={saving}
          />
        )}
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-sm">Nog geen verdiepingen. Voeg een verdieping toe om te beginnen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-gray-800">{counts.total} kamers</span>
          <span className="flex items-center gap-1.5 text-green-700">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            {counts.available} beschikbaar
          </span>
          <span className="flex items-center gap-1.5 text-yellow-700">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
            {counts.reserved} gereserveerd
          </span>
          <span className="flex items-center gap-1.5 text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            {counts.rented} verhuurd
          </span>
        </div>
        <button
          className="text-sm text-gray-500 border border-dashed border-gray-300 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
          onClick={() => setShowAddFloor(!showAddFloor)}
        >
          + Verdieping
        </button>
      </div>

      {showAddFloor && (
        <AddFloorForm
          form={floorForm}
          setForm={setFloorForm}
          onSave={addFloor}
          onCancel={() => setShowAddFloor(false)}
          saving={saving}
        />
      )}

      {/* Main layout: building grid + detail panel */}
      <div className={`grid gap-5 ${selectedRoom ? "grid-cols-1 xl:grid-cols-3" : "grid-cols-1"}`}>

        {/* Building grid (takes 2/3 when panel open) */}
        <div className={`space-y-4 ${selectedRoom ? "xl:col-span-2" : ""}`}>
          {[...floors].sort((a, b) => a.level - b.level).map((floor) => {
            const rooms = floor.rooms ?? [];

            return (
              <div key={floor.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Floor header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{floor.floor_name}</span>
                    <span className="text-xs text-gray-400">{rooms.length} kamers</span>
                    <div className="flex items-center gap-2 text-xs">
                      {(["available","reserved","rented"] as const).map((s) => {
                        const n = rooms.filter((r) => r.availability_status === s).length;
                        if (!n) return null;
                        return (
                          <span key={s} className={`${STATUS_CONFIG[s].text} font-medium`}>
                            {n} {s === "available" ? "vrij" : s === "reserved" ? "res." : "verhuurd"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {addingRoomToFloor === floor.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          className="border border-gray-300 rounded px-2 py-1 text-xs w-28"
                          placeholder="bv. 29A/0110"
                          value={newRoomLabel}
                          onChange={(e) => setNewRoomLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addRoom(floor.id, newRoomLabel);
                            if (e.key === "Escape") { setAddingRoomToFloor(null); setNewRoomLabel(""); }
                          }}
                          autoFocus
                        />
                        <button className="text-xs bg-primary text-white px-2 py-1 rounded" onClick={() => addRoom(floor.id, newRoomLabel)} disabled={saving}>+</button>
                        <button className="text-xs text-gray-400 px-1" onClick={() => { setAddingRoomToFloor(null); setNewRoomLabel(""); }}>✕</button>
                      </div>
                    ) : (
                      <button className="text-xs text-gray-400 hover:text-primary px-2 py-1" onClick={() => setAddingRoomToFloor(floor.id)}>+ Kamer</button>
                    )}
                    <button className="text-xs text-red-400 hover:text-red-600 px-1" onClick={() => deleteFloor(floor.id)}>✕</button>
                  </div>
                </div>

                {/* Room grid */}
                <div className="p-3 bg-white">
                  {rooms.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2 text-center">Geen kamers. Klik &quot;+ Kamer&quot; om toe te voegen.</p>
                  ) : (
                    <RoomGrid rooms={rooms} selected={selectedRoom?.id} onSelect={setSelectedRoom} onQuickToggle={quickToggle} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Room detail panel */}
        {selectedRoom && (
          <div className="border border-gray-200 rounded-xl bg-white p-5 space-y-4 h-fit sticky top-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-base">{selectedRoom.room_label}</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {STATUS_CONFIG[selectedRoom.availability_status].label}
                  {selectedRoom.size_m2 ? ` · ${selectedRoom.size_m2}m²` : ""}
                </p>
              </div>
              <button className="text-gray-300 hover:text-gray-500 text-lg leading-none" onClick={() => setSelectedRoom(null)}>✕</button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Naam / nummer</label>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                  value={roomForm.room_label}
                  onChange={(e) => setRoomForm({ ...roomForm, room_label: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["available", "reserved", "rented", "hidden"] as const).map((s) => (
                    <button
                      key={s}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        roomForm.availability_status === s
                          ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].border} ${STATUS_CONFIG[s].text}`
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setRoomForm({ ...roomForm, availability_status: s })}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Opp. (m²)</label>
                <input
                  type="number" step="0.01"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                  value={roomForm.size_m2}
                  onChange={(e) => setRoomForm({ ...roomForm, size_m2: e.target.value })}
                  placeholder="bv. 14.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Gekoppeld kot</label>
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                  value={roomForm.kot_id}
                  onChange={(e) => {
                    const kotId = e.target.value;
                    const kot = koten.find((k) => k.id === kotId);
                    setRoomForm({
                      ...roomForm,
                      kot_id: kotId,
                      ...(kot ? { availability_status: kot.availability_status } : {}),
                    });
                  }}
                >
                  <option value="">— Niet gekoppeld —</option>
                  {koten.map((k) => <option key={k.id} value={k.id}>{k.title}</option>)}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  onClick={saveRoom}
                  disabled={saving}
                >
                  {saving ? "Opslaan…" : "Opslaan"}
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-sm text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
                  onClick={() => deleteRoom(selectedRoom.id)}
                >
                  Verwijder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact room grid sub-component
function RoomGrid({
  rooms,
  selected,
  onSelect,
  onQuickToggle,
}: {
  rooms: BuildingRoom[];
  selected?: string | null;
  onSelect: (r: BuildingRoom) => void;
  onQuickToggle: (r: BuildingRoom, e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {rooms.map((room) => {
        const cfg = STATUS_CONFIG[room.availability_status] ?? STATUS_CONFIG.available;
        const isSelected = room.id === selected;
        return (
          <button
            key={room.id}
            title={`${room.room_label}${room.size_m2 ? ` · ${room.size_m2}m²` : ""} · ${cfg.label}\nKlik om te bewerken · Dubbelklik om status te wisselen`}
            className={`relative group flex flex-col items-center justify-center rounded-lg border-2 transition-all
              w-[72px] h-[52px] text-center
              ${cfg.bg} ${cfg.border}
              ${isSelected ? "ring-2 ring-offset-1 ring-blue-500 scale-105 shadow-md" : "hover:scale-105 hover:shadow-sm"}`}
            onClick={() => onSelect(room)}
            onDoubleClick={(e) => onQuickToggle(room, e)}
          >
            <span className={`text-[10px] font-bold leading-tight ${cfg.text} max-w-full px-1 truncate`}>
              {room.room_label}
            </span>
            {room.size_m2 && (
              <span className={`text-[9px] ${cfg.text} opacity-70`}>{room.size_m2}m²</span>
            )}
            {/* Status dot */}
            <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          </button>
        );
      })}
    </div>
  );
}

function AddFloorForm({
  form, setForm, onSave, onCancel, saving,
}: {
  form: { floor_name: string; level: string };
  setForm: (f: { floor_name: string; level: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex gap-3 items-end flex-wrap">
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Naam</label>
        <input
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48"
          placeholder="bv. 1e Verdieping"
          value={form.floor_name}
          onChange={(e) => setForm({ ...form, floor_name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Niveau</label>
        <select
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          <option value="-1">Kelder (-1)</option>
          <option value="0">Gelijkvloers (0)</option>
          <option value="1">1e Verdieping</option>
          <option value="2">2e Verdieping</option>
          <option value="3">3e Verdieping / Zolder</option>
          <option value="4">4e Verdieping</option>
        </select>
      </div>
      <button
        className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
        onClick={onSave}
        disabled={saving || !form.floor_name}
      >
        Toevoegen
      </button>
      <button className="text-gray-500 text-sm px-2" onClick={onCancel}>Annuleren</button>
    </div>
  );
}
