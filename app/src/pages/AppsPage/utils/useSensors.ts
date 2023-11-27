import { MouseSensor, TouchSensor, useSensor, useSensors as useDefaultSensores } from '@dnd-kit/core'

export const useSensors = () => {
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating.
    // Slight distance prevents sortable logic messing with
    // interactive elements in the handler toolbar component.
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 300ms, with tolerance of 5px of movement.
    activationConstraint: {
      delay: 200,
      tolerance: 5
    }
  })
  const sensors = useDefaultSensores(mouseSensor, touchSensor)

  return sensors
}
