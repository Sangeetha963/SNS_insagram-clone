import { render } from '@testing-library/react'

import { CEdit } from './CEdit'

describe('CEdit', () => {
    // describe('logic', () => {})
    // describe('view', () => {})
    describe('component', () => {
        test('render', () => {
            const { getByTestId } = render(<CEdit />)

            const element = getByTestId('c-edit')
            expect(element).toBeInTheDocument()
        })
    })
})
