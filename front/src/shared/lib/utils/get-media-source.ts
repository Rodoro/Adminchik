import { MEDIA_URL } from '@/shared/constants/url.constants'

export function getMediaSource(path: string | undefined | null) {
	return MEDIA_URL + path
}
