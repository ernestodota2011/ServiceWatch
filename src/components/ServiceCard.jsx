import React, { useState } from 'react'
import { Card, Text, Group, Badge, ActionIcon, Button, TextInput, Stack, Collapse, Box } from '@mantine/core'
import { IconEdit, IconTrash, IconCheck, IconX, IconLink, IconApi, IconWebhook } from '@tabler/icons-react'

export default function ServiceCard({ service, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [editedService, setEditedService] = useState(service)

  const handleSave = () => {
    onEdit(service.id, editedService)
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online': return 'green'
      case 'offline': return 'red'
      default: return 'yellow'
    }
  }

  if (isEditing) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <TextInput
            label="Name"
            value={editedService.name}
            onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
          />
          <TextInput
            label="Description"
            value={editedService.description}
            onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
          />
          <TextInput
            label="URL"
            value={editedService.url}
            onChange={(e) => setEditedService({ ...editedService, url: e.target.value })}
          />
          {editedService.apiUrl && (
            <TextInput
              label="API URL"
              value={editedService.apiUrl}
              onChange={(e) => setEditedService({ ...editedService, apiUrl: e.target.value })}
            />
          )}
          {editedService.webhookUrl && (
            <TextInput
              label="Webhook URL"
              value={editedService.webhookUrl}
              onChange={(e) => setEditedService({ ...editedService, webhookUrl: e.target.value })}
            />
          )}
          <Group justify="flex-end">
            <ActionIcon variant="filled" color="green" onClick={handleSave}>
              <IconCheck size={16} />
            </ActionIcon>
            <ActionIcon variant="filled" color="red" onClick={() => setIsEditing(false)}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Stack>
      </Card>
    )
  }

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="lg">{service.name}</Text>
        <Badge color={getStatusColor(service.status)} variant="light" size="lg">
          {service.status}
        </Badge>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {service.description}
      </Text>

      <Button 
        component="a"
        href={service.url}
        target="_blank"
        variant="light"
        fullWidth
        mb="sm"
        leftSection={<IconLink size={16} />}
      >
        Visit Service
      </Button>

      <Button
        variant="subtle"
        fullWidth
        mb="sm"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </Button>

      <Collapse in={showDetails}>
        <Box mt="md">
          {service.apiUrl && (
            <Button
              component="a"
              href={service.apiUrl}
              target="_blank"
              variant="subtle"
              fullWidth
              mb="xs"
              leftSection={<IconApi size={16} />}
            >
              API Endpoint
            </Button>
          )}
          {service.webhookUrl && (
            <Button
              component="a"
              href={service.webhookUrl}
              target="_blank"
              variant="subtle"
              fullWidth
              mb="xs"
              leftSection={<IconWebhook size={16} />}
            >
              Webhook URL
            </Button>
          )}
        </Box>
      </Collapse>

      <Group justify="flex-end" mt="md">
        <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
          <IconEdit size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="red" onClick={() => onDelete(service.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Card>
  )
}
