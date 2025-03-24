import React, { useState } from 'react'
import { Modal, TextInput, Button, Group, Stack } from '@mantine/core'
import { IconDeviceFloppy } from '@tabler/icons-react'

export default function AddServiceModal({ opened, onClose, onAdd }) {
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
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Add New Service"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <TextInput
            required
            label="Service Name"
            placeholder="Enter service name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <TextInput
            label="Description"
            placeholder="Enter service description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />
          <TextInput
            required
            label="URL"
            placeholder="Enter service URL"
            value={newService.url}
            onChange={(e) => setNewService({ ...newService, url: e.target.value })}
          />
          <TextInput
            label="API URL (optional)"
            placeholder="Enter API URL"
            value={newService.apiUrl}
            onChange={(e) => setNewService({ ...newService, apiUrl: e.target.value })}
          />
          <TextInput
            label="Webhook URL (optional)"
            placeholder="Enter webhook URL"
            value={newService.webhookUrl}
            onChange={(e) => setNewService({ ...newService, webhookUrl: e.target.value })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit"
              leftSection={<IconDeviceFloppy size={16} />}
              variant="gradient"
              gradient={{ from: '#FF6B6B', to: '#4ECDC4', deg: 45 }}
            >
              Save Service
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
