'use client'

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { PropsWithChildren } from 'react'
import { Session } from '../types/session.types'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/overlay/dialog'
import { formatDate } from '@/shared/lib/utils/format-date'

interface SessionModalProps {
    session: Session
}

export function SessionModal({
    children,
    session
}: PropsWithChildren<SessionModalProps>) {
    const center = [
        session.metadata.location.latidute,
        session.metadata.location.longidute
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogTitle className='text-xl'>Информация о сессии</DialogTitle>
                <div className='space-y-3'>
                    <div className='flex items-center'>
                        <span className='font-medium'>Устройство:</span>
                        <span className='ml-2 text-muted-foreground'>
                            {session.metadata.device.browser}, {session.metadata.device.os}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <span className='font-medium'>Местоположение:</span>
                        <span className='ml-2 text-muted-foreground'>
                            {session.metadata.location.country}, {session.metadata.location.city}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <span className='font-medium'>IP-адрес:</span>
                        <span className='ml-2 text-muted-foreground'>
                            {session.metadata.ip}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <span className='font-medium'>Дата создания:</span>
                        <span className='ml-2 text-muted-foreground'>
                            {formatDate(session.createdAt, true)}
                        </span>
                    </div>
                    <YMaps>
                        <div style={{ width: '100%', height: '300px' }}>
                            <Map
                                defaultState={{
                                    center,
                                    zoom: 11
                                }}
                                width='100%'
                                height='100%'
                            >
                                <Placemark geometry={center} />
                            </Map>
                        </div>
                    </YMaps>
                </div>
            </DialogContent>
        </Dialog>
    )
}