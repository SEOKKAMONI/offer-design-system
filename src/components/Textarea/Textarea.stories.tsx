import type { Meta, Story } from '@storybook/react'
import { TextArea } from './index'
import type { TextAreaProps } from './index'

export default {
  argTypes: {
    children: {
      control: { type: 'text' }
    }
  },
  component: TextArea,
  title: 'Components/TextArea'
} as Meta<TextAreaProps>

const Template: Story<TextAreaProps> = args => <TextArea {...args} />

export const Default = Template.bind({})

Default.args = {
  bgType: 'filled',
  guideMessage: '안내 메세지',
  label: '라벨'
}
