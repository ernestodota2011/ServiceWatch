import React, { useState } from 'react'
import { Paper, TextInput, Button, Group, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

export default function AddServiceForm({ onAdd }) {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    url: '',
    apiUrl: '',
    webhookUrl: '',
    status: 'Unknown'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(newService)
    setNewService({ 
      name: '', 
      description: '', 
      url: '', 
      apiUrl: '', 
      webhookUrl: '', 
      status: 'Unknown' 
    })
  }

  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder mb="xl">
      <Title order={4} mb="md">Add New Service</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Service Name"
          placeholder="Enter service name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Description"
          placeholder="Enter service description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          mb="sm"
        />
        <TextInput
          required
          label="URL"
          placeholder="Enter service URL"
          value={newService.url}
          onChange={(e) => setNewService({ ...newService, url: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="API URL (optional)"
          placeholder="Enter API URL"
          value={newService.apiUrl}
          onChange={(e) => setNewService({ ...newService, apiUrl: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Webhook URL (optional)"
          placeholder="Enter webhook URL"
          value={newService.webhookUrl}
          onChange={(e) => setNewService({ ...newService, webhookUrl: e.target.value })}
          mb="sm"
        />
        <Group justify="flex-end">
          <Button type="submit" leftSection={<IconPlus size={16} />}>
            Add Service
          </Button>
        </Group>
      </form>
    </Paper>
  )
}
