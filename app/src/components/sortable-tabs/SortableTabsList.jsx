import React, { useCallback, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTabItem } from "./SortableTabItem";

import { arrayMoveImmutable } from "array-move";

export const SortableTabsList = () => {
  const [activeId, setActiveId] = useState(null);

  const [items, setItems] = useState(() =>
    [0, 1, 2, 3, 4, 5].map((id) => id + 1)
  );

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      setItems((items) => arrayMoveImmutable(items, oldIndex, newIndex));
    },
    [items]
  );

  const getIndex = (id) => items.indexOf(+id);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating.
    // Slight distance prevents sortable logic messing with
    // interactive elements in the handler toolbar component.
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement.
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      sensors={sensors}
      autoScroll={false}
      onDragStart={({ active }) => {
        if (active) {
          setActiveId(active.id);
        }
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          onSortEnd({
            oldIndex: getIndex(active.id),
            newIndex: getIndex(over.id),
          });
        }
        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="sortable-list">
          {items.map((id, index) => (
            <SortableTabItem key={`item-${id}`} id={id} activeId={activeId} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
