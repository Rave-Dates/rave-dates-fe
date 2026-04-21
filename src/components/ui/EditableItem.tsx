"use client";

import React, { useState, useEffect } from "react";
import EditSvg from "../svg/EditSvg";
import TrashSvg from "../svg/TrashSvg";
import CheckSvg from "../svg/CheckSvg";
import SubtractSvg from "../svg/SubtractSvg";

interface EditableItemProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  onDelete: () => void;
  className?: string;
  isSaving?: boolean;
}

export default function EditableItem({
  initialValue,
  onSave,
  onDelete,
  className = "",
  isSaving = false,
}: EditableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Update internal value if initialValue changes externally
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue !== initialValue) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  return (
    <div className={`bg-primary rounded-xl flex items-center transition-all duration-200 animate-fade-in ${className}`}>


      <div className="flex items-center h-8">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              className="text-primary rounded-l-md bg-divider w-8 h-full flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Guardar"
              disabled={isSaving}
            >
              <CheckSvg className="text-xl" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-system-error bg-divider w-8 h-full flex items-center justify-center hover:bg-white/20 transition-colors border-l border-white/30"
              title="Cancelar"
              disabled={isSaving}
            >
              <SubtractSvg className="text-xl" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-orange-400 rounded-l-md w-8 bg-divider h-full flex items-center justify-center hover:bg-white/20 transition-colors border-l border-primary-black/10"
            title="Editar"
          >
            <EditSvg className="text-xl" />
          </button>
        )}

        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-sm px-3 py-1 text-primary-white font-semibold bg-white/30 outline-none w-fit border-none focus:ring-0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            disabled={isSaving}
          />
        ) : (
          <h1 className="text-sm px-3 py-1 text-primary-white font-semibold truncate max-w-[150px]">
            {initialValue}
          </h1>
        )}


        <button
          type="button"
          onClick={onDelete}
          className="text-system-error w-10 h-full rounded-r-md flex items-center justify-center bg-divider hover:bg-system-error/80 transition-colors border-l border-primary-black/10"
          title="Eliminar"
          disabled={isSaving}
        >
          <TrashSvg className="text-xl stroke-2" />
        </button>
      </div>
    </div>
  );
}
