import React from 'react'
import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      placeholder="Search services..."
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="md"
      w={300}
    />
  )
}
