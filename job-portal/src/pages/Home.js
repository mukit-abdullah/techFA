import { useEffect, useState } from 'react';
import { fetchJobs, deleteJob, createJob, updateJob } from '../services/jobService';
import { 
  Container, Typography, Button, Grid, Box, TextField, CircularProgress,
  Card, CardContent, Collapse, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton
} from '@mui/material';
import { 
  Add as AddIcon, Work as WorkIcon, Business as BusinessIcon,
  LocationOn as LocationIcon, AttachMoney as MoneyIcon, Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon, Palette as PaletteIcon, People as PeopleIcon,
  AdminPanelSettings as AdminIcon, Campaign as MarketingIcon, Code as CodeIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';

const jobCategories = [
  { id: 'sales-marketing', name: 'Sales & Marketing', icon: TrendingUpIcon, color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' },
  { id: 'creative', name: 'Creative', icon: PaletteIcon, color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6EE5DD 100%)' },
  { id: 'human-resource', name: 'Human Resource', icon: PeopleIcon, color: '#45B7D1', gradient: 'linear-gradient(135deg, #45B7D1 0%, #67C3E0 100%)' },
  { id: 'administration', name: 'Administration', icon: AdminIcon, color: '#F9CA24', gradient: 'linear-gradient(135deg, #F9CA24 0%, #F0B90B 100%)' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: MarketingIcon, color: '#6C5CE7', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #8B7ED8 100%)' },
  { id: 'development', name: 'Development', icon: CodeIcon, color: '#00B894', gradient: 'linear-gradient(135deg, #00B894 0%, #00CCA3 100%)' },
  { id: 'engineering', name: 'Engineering', icon: EngineeringIcon, color: '#E17055', gradient: 'linear-gradient(135deg, #E17055 0%, #E84A5F 100%)' }
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', category: '' });
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchJobs();
      setJobs(res.data);
    } catch (err) {
      alert('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await deleteJob(id);
      loadJobs();
    } catch (err) {
      alert('Failed to delete job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.description || !form.location) {
      return alert("Please fill all required fields (Title, Company, Description, Location)");
    }
    try {
      setSubmitting(true);
      const jobData = { ...form, category: selectedCategory };
      if (editingJob) {
        await updateJob(editingJob.id || editingJob._id, jobData);
      } else {
        await createJob(jobData);
      }
      handleCancel();
      loadJobs();
    } catch (err) {
      alert(`Failed to ${editingJob ? 'update' : 'create'} job`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setSelectedCategory(job.category);
    setForm({ 
      title: job.title || '', company: job.company || '', description: job.description || '', 
      location: job.location || '', salary: job.salary || '', category: job.category || ''
    });
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setEditingJob(null);
    setSelectedCategory(null);
    setForm({ title: '', company: '', description: '', location: '', salary: '', category: '' });
    setOpenDialog(false);
  };

  const handleAddJobToCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setForm({ title: '', company: '', description: '', location: '', salary: '', category: categoryId });
    setOpenDialog(true);
  };

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const getJobsByCategory = (categoryId) => jobs.filter(job => job.category === categoryId);
  const getCategoryInfo = (categoryId) => jobCategories.find(cat => cat.id === categoryId);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => { loadJobs(); }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
            BROWSE OPEN POSITIONS BY CATEGORY
          </Typography>
          <Box sx={{ width: 60, height: 4, background: 'linear-gradient(45deg, #27ae60, #2ecc71)', mx: 'auto', mb: 2, borderRadius: 2 }} />
          <Typography variant="h6" sx={{ color: '#7f8c8d', fontWeight: 400 }}>
            We are always on the lookout for talented people
          </Typography>
        </Box>

        {/* Job Categories */}
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            const categoryJobs = getJobsByCategory(category.id);
            const isExpanded = expandedCategories[category.id];
            
            return (
              <Card key={category.id} elevation={2} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #e9ecef', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                {/* Category Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, background: '#fff', cursor: 'pointer', '&:hover': { backgroundColor: '#f8f9fa' } }} onClick={() => handleCategoryToggle(category.id)}>
                  <Box display="flex" alignItems="center" flex={1}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: category.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3 }}>
                      <IconComponent sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 600, mb: 0.5 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        {categoryJobs.length} position{categoryJobs.length !== 1 ? 's' : ''} available
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleAddJobToCategory(category.id); }} sx={{ background: category.gradient, color: 'white', width: 40, height: 40, '&:hover': { background: category.gradient, transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
                      <AddIcon />
                    </IconButton>
                    <IconButton sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Category Jobs */}
                <Collapse in={isExpanded}>
                  <Box sx={{ p: 3, pt: 0, background: '#f8f9fa' }}>
                    {categoryJobs.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
                        <WorkIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                        <Typography variant="body1">No jobs in this category yet.</Typography>
                        <Typography variant="body2">Click the + button to add the first job!</Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {categoryJobs.map(job => (
                          <Grid item xs={12} md={6} key={job.id || job._id}>
                            <Card elevation={1} sx={{ p: 2, background: 'white', borderRadius: 2, border: `2px solid ${category.color}20`, '&:hover': { borderColor: category.color, transform: 'translateY(-2px)', boxShadow: `0 4px 20px ${category.color}30` }, transition: 'all 0.3s ease' }}>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Box flex={1}>
                                  <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 600, mb: 1 }}>{job.title}</Typography>
                                  <Typography variant="body2" sx={{ color: category.color, fontWeight: 500, mb: 1 }}>{job.company}</Typography>
                                  <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>📍 {job.location}</Typography>
                                  {job.salary && <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 500 }}>💰 {job.salary}</Typography>}
                                </Box>
                                <Box display="flex" gap={1}>
                                  <IconButton size="small" onClick={() => handleEdit(job)} sx={{ color: '#3498db', '&:hover': { background: '#3498db20', transform: 'scale(1.1)' } }}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDelete(job.id || job._id)} sx={{ color: '#e74c3c', '&:hover': { background: '#e74c3c20', transform: 'scale(1.1)' } }}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography variant="body2" sx={{ color: '#7f8c8d', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {job.description}
                              </Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      </Container>
      
      {/* Job Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCancel} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)' } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              {selectedCategory && (() => {
                const categoryInfo = getCategoryInfo(selectedCategory);
                const IconComponent = categoryInfo?.icon || WorkIcon;
                return (
                  <>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: categoryInfo?.gradient || 'linear-gradient(45deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      <IconComponent sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{editingJob ? 'Edit Job' : 'Add New Job'}</Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>{categoryInfo?.name}</Typography>
                    </Box>
                  </>
                );
              })()}
            </Box>
            <IconButton onClick={handleCancel}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" sx={{ '& > *': { mb: 2.5 } }}>
            <TextField fullWidth label="Job Title" name="title" value={form.title} onChange={handleChange} disabled={submitting} required InputProps={{ startAdornment: <WorkIcon sx={{ color: '#667eea', mr: 1 }} /> }} />
            <TextField fullWidth label="Company Name" name="company" value={form.company} onChange={handleChange} disabled={submitting} required InputProps={{ startAdornment: <BusinessIcon sx={{ color: '#667eea', mr: 1 }} /> }} />
            <TextField fullWidth label="Job Description" name="description" value={form.description} onChange={handleChange} disabled={submitting} multiline rows={4} required InputProps={{ startAdornment: <DescriptionIcon sx={{ color: '#667eea', mr: 1, alignSelf: 'flex-start', mt: 1 }} /> }} />
            <TextField fullWidth label="Location" name="location" value={form.location} onChange={handleChange} disabled={submitting} required InputProps={{ startAdornment: <LocationIcon sx={{ color: '#667eea', mr: 1 }} /> }} />
            <TextField fullWidth label="Salary (Optional)" name="salary" value={form.salary} onChange={handleChange} disabled={submitting} placeholder="e.g., $50,000 - $70,000" InputProps={{ startAdornment: <MoneyIcon sx={{ color: '#667eea', mr: 1 }} /> }} />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCancel} disabled={submitting} sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting} sx={{ background: selectedCategory ? getCategoryInfo(selectedCategory)?.gradient : 'linear-gradient(45deg, #667eea, #764ba2)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }, transition: 'all 0.3s ease' }}>
            {submitting ? <CircularProgress size={20} color="inherit" /> : (editingJob ? 'Update Job' : 'Create Job')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
