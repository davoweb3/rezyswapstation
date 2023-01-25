import { useAppIconset } from '@/common/components/AppIconset/useAppIconset/useAppIconset.js';
import * as appIcons from '@/assets/app-icons/index.js';

export function setupAppIconset() {
    const { setIconset } = useAppIconset();
    setIconset(appIcons);
}
