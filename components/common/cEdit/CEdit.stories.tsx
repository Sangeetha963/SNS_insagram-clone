import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CEdit } from './CEdit'

export default {
    title: 'common/cEdit',
    component: CEdit,
} as ComponentMeta<typeof CEdit>

const Template: ComponentStory<typeof CEdit> = ({ ...args }) => <CEdit {...args} />

export const Primary = Template.bind({})
Primary.args = {}
