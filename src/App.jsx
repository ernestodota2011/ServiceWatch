import React, { useState, useEffect } from 'react'
import { Container, Title, Text, Group, Button, Select, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import ServiceList from './components/ServiceList'
import AddServiceModal from './components/AddServiceModal'
import SearchBar from './components/SearchBar'
import { initialServices } from './data/services'

export default function App() {
  const [opened, { open, close }] = useDisclosure(false)
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState('10')

  useEffect(() => {
    const savedServices = localStorage.getItem('services')
    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      setServices(initialServices)
      localStorage.setItem('services', JSON.stringify(initialServices))
    }
  }, [])

  const handleAddService = (newService) => {
    const updatedServices = [...services, { ...newService, id: Date.now() }]
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
    close()
  }

  const handleEditService = (id, updatedService) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    )
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
  }

  const handleDeleteService = (id) => {
    const updatedServices = services.filter(service => service.id !== id)
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container size="xl" py="xl">
      <Group justify="center" mb={50}>
        <div style={{ textAlign: 'center' }}>
          <Title
            order={1}
            size="h1"
            style={{
              background: 'linear-gradient(45deg, #FF6B6B 10%, #4ECDC4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ServiceWatch
          </Title>
          <Text c="dimmed" mt="xs">Monitor and manage your service infrastructure</Text>
        </div>
      </Group>

      <Stack spacing="md" mb="xl">
        <Group justify="space-between" align="flex-end">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Group>
            <Select
              label="Items per page"
              value={itemsPerPage}
              onChange={setItemsPerPage}
              data={[
                { value: '10', label: '10 items' },
                { value: '20', label: '20 items' },
                { value: '50', label: '50 items' },
                { value: '100', label: 'All items' }
              ]}
              w={120}
            />
            <Button 
              onClick={open}
              leftSection={<IconPlus size={16} />}
              variant="gradient"
              gradient={{ from: '#FF6B6B', to: '#4ECDC4', deg: 45 }}
            >
              Add Service
            </Button>
          </Group>
        </Group>
      </Stack>

      <ServiceList 
        services={filteredServices}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        itemsPerPage={parseInt(itemsPerPage)}
      />

      <AddServiceModal
        opened={opened}
        onClose={close}
        onAdd={handleAddService}
      />
    </Container>
  )
}
