import { EditIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Schemas } from '~/apis/types'
// import { PostEntites } from '~/apis/types'
import { NsPropTypeBase } from '~/types/ns-prop-type-base'
import { ClientPostUpdateDto } from '~/types/zod-scheme'

export type CEditProps = {
    submitEdit: (dto: Schemas.ClientPostUpdateDto) => void
    edit?: Schemas.PostEntities
    children?: ReactNode
} & NsPropTypeBase

// logic
const useCEdit = (props: CEditProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { submitEdit, edit } = props
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Schemas.ClientPostUpdateDto>({ resolver: zodResolver(ClientPostUpdateDto) })
    const handleClose = () => {
        onClose()
        reset()
    }
    const handleopen = () => {
        onOpen()
        reset()
    }
    return { isOpen, onClose, onOpen, submitEdit, edit, register, handleSubmit, errors, handleClose, handleopen }
}

// view
const CEditView: FC<CEditProps & ReturnType<typeof useCEdit>> = (props) => {
    const { isOpen, handleClose, submitEdit, edit, register, handleSubmit, errors, handleopen, onClose } = props

    return (
        <>
            <Button bgColor={'#7BCCB5'} onClick={handleopen}>
                <EditIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleSubmit(submitEdit)}>
                    <ModalContent>
                        <ModalHeader>Edit Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Textarea placeholder="Edit your Post" {...register('content')} defaultValue={edit?.content || ''} />
                            {errors.content && <Box color="red">{errors.content?.message}</Box>}
                        </ModalBody>
                        <ModalFooter>
                            <Button mr={3} onClick={handleClose} bg={'#7BCCB5'}>
                                Cancel
                            </Button>
                            <Button type="submit" bg="#7BCCB5" onClick={onClose}>
                                submit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}

// component
export const CEdit: FC<CEditProps> = (props: CEditProps) => {
    const hookItems = useCEdit(props)
    return <CEditView {...props} {...hookItems} />
}
