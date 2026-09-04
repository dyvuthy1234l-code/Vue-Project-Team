import { ref } from 'vue'

interface ChecklistStore {
  [serviceId: string]: {
    [docIndex: number]: boolean
  }
}

const checklistState = ref<ChecklistStore>(
  JSON.parse(localStorage.getItem('camlife-checklists') || '{}')
)

export function useChecklist(serviceId: string, totalItemsCount: number = 0) {
  if (!checklistState.value[serviceId]) {
    checklistState.value[serviceId] = {}
  }

  function isItemChecked(index: number): boolean {
    return !!checklistState.value[serviceId]?.[index]
  }

  function toggleItem(index: number) {
    if (!checklistState.value[serviceId]) {
      checklistState.value[serviceId] = {}
    }
    const current = !!checklistState.value[serviceId][index]
    checklistState.value[serviceId][index] = !current
    saveToStorage()
  }

  function setItemChecked(index: number, checked: boolean) {
    if (!checklistState.value[serviceId]) {
      checklistState.value[serviceId] = {}
    }
    checklistState.value[serviceId][index] = checked
    saveToStorage()
  }

  function resetChecklist() {
    checklistState.value[serviceId] = {}
    saveToStorage()
  }

  function getCheckedCount(): number {
    const items = checklistState.value[serviceId] || {}
    return Object.values(items).filter(Boolean).length
  }

  function getProgressPercentage(): number {
    if (totalItemsCount <= 0) return 0
    const checked = getCheckedCount()
    return Math.round((checked / totalItemsCount) * 100)
  }

  function saveToStorage() {
    localStorage.setItem('camlife-checklists', JSON.stringify(checklistState.value))
  }

  return {
    isItemChecked,
    toggleItem,
    setItemChecked,
    resetChecklist,
    getCheckedCount,
    getProgressPercentage
  }
}
