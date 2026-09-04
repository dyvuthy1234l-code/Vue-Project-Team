import { ref, computed } from 'vue'

export interface ProvinceLocation {
  id: string
  name: string
  nameKh: string
  code: string
  coordinates: { lat: number; lng: number }
}

export const CAMBODIAN_PROVINCES: ProvinceLocation[] = [
  { id: 'phnom-penh', name: 'Phnom Penh', nameKh: 'រាជធានីភ្នំពេញ', code: 'PP', coordinates: { lat: 11.5564, lng: 104.9282 } },
  { id: 'kandal', name: 'Kandal', nameKh: 'ខេត្តកណ្តាល', code: 'KD', coordinates: { lat: 11.4554, lng: 104.9454 } },
  { id: 'siem-reap', name: 'Siem Reap', nameKh: 'ខេត្តសៀមរាប', code: 'SR', coordinates: { lat: 13.3671, lng: 103.8448 } },
  { id: 'battambang', name: 'Battambang', nameKh: 'ខេត្តបាត់ដំបង', code: 'BB', coordinates: { lat: 13.0957, lng: 103.2022 } },
  { id: 'preah-sihanouk', name: 'Preah Sihanouk', nameKh: 'ខេត្តព្រះសីហនុ', code: 'SHV', coordinates: { lat: 10.6275, lng: 103.5221 } },
  { id: 'kampong-cham', name: 'Kampong Cham', nameKh: 'ខេត្តកំពង់ចាម', code: 'KC', coordinates: { lat: 11.9924, lng: 105.4645 } },
  { id: 'kampot', name: 'Kampot', nameKh: 'ខេត្តកំពត', code: 'KP', coordinates: { lat: 10.6104, lng: 104.1815 } },
  { id: 'takeo', name: 'Takeo', nameKh: 'ខេត្តតាកែវ', code: 'TK', coordinates: { lat: 10.9908, lng: 104.7850 } },
  { id: 'kampong-chhnang', name: 'Kampong Chhnang', nameKh: 'ខេត្តកំពង់ឆ្នាំង', code: 'KCH', coordinates: { lat: 12.2500, lng: 104.6667 } },
  { id: 'kampong-speu', name: 'Kampong Speu', nameKh: 'ខេត្តកំពង់ស្ពឺ', code: 'KS', coordinates: { lat: 11.4533, lng: 104.5209 } },
  { id: 'kampong-thom', name: 'Kampong Thom', nameKh: 'ខេត្តកំពង់ធំ', code: 'KT', coordinates: { lat: 12.7111, lng: 104.8887 } },
  { id: 'koh-kong', name: 'Koh Kong', nameKh: 'ខេត្តកោះកុង', code: 'KK', coordinates: { lat: 11.6153, lng: 102.9838 } },
  { id: 'kratie', name: 'Kratie', nameKh: 'ខេត្តក្រចេះ', code: 'KR', coordinates: { lat: 12.4881, lng: 106.0188 } },
  { id: 'mondulkiri', name: 'Mondulkiri', nameKh: 'ខេត្តមណ្ឌលគិរី', code: 'MK', coordinates: { lat: 12.4558, lng: 107.1881 } },
  { id: 'preah-vihear', name: 'Preah Vihear', nameKh: 'ខេត្តព្រះវិហារ', code: 'PV', coordinates: { lat: 13.8073, lng: 104.9805 } },
  { id: 'prey-veng', name: 'Prey Veng', nameKh: 'ខេត្តព្រៃវែង', code: 'PVG', coordinates: { lat: 11.4868, lng: 105.3253 } },
  { id: 'pursat', name: 'Pursat', nameKh: 'ខេត្តពោធិ៍សាត់', code: 'PS', coordinates: { lat: 12.5388, lng: 103.9192 } },
  { id: 'ratanakiri', name: 'Ratanakiri', nameKh: 'ខេត្តរតនគិរី', code: 'RK', coordinates: { lat: 13.7394, lng: 106.9873 } },
  { id: 'stung-treng', name: 'Stung Treng', nameKh: 'ខេត្តស្ទឹងត្រែង', code: 'ST', coordinates: { lat: 13.5259, lng: 105.9683 } },
  { id: 'svay-rieng', name: 'Svay Rieng', nameKh: 'ខេត្តស្វាយរៀង', code: 'SVR', coordinates: { lat: 11.0879, lng: 105.7994 } },
  { id: 'banteay-meanchey', name: 'Banteay Meanchey', nameKh: 'ខេត្តបន្ទាយមានជ័យ', code: 'BMC', coordinates: { lat: 13.6672, lng: 102.8975 } },
  { id: 'kep', name: 'Kep', nameKh: 'ខេត្តកែប', code: 'KEP', coordinates: { lat: 10.4829, lng: 104.3167 } },
  { id: 'pailin', name: 'Pailin', nameKh: 'ខេត្តប៉ៃលិន', code: 'PL', coordinates: { lat: 12.8489, lng: 102.6093 } },
  { id: 'oddar-meanchey', name: 'Oddar Meanchey', nameKh: 'ខេត្តឧត្តរមានជ័យ', code: 'OMC', coordinates: { lat: 14.1818, lng: 103.5176 } },
  { id: 'tboung-khmum', name: 'Tboung Khmum', nameKh: 'ខេត្តត្បូងឃ្មុំ', code: 'TBK', coordinates: { lat: 11.9056, lng: 105.6568 } }
]

const currentProvinceId = ref<string>(
  localStorage.getItem('camlife-selected-location') || 'phnom-penh'
)

export function useLocation() {
  const selectedProvince = computed(() => {
    return CAMBODIAN_PROVINCES.find(p => p.id === currentProvinceId.value) || CAMBODIAN_PROVINCES[0]
  })

  function setProvince(id: string) {
    currentProvinceId.value = id
    localStorage.setItem('camlife-selected-location', id)
  }

  return {
    provinces: CAMBODIAN_PROVINCES,
    currentProvinceId,
    selectedProvince,
    setProvince
  }
}
