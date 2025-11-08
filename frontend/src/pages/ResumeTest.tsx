import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobBlock, ZoomLevel, ComponentFocus } from '@/types/blockResume';
import { emaadResumeBlocks } from '@/data/emaadResume';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Briefcase, MapPin, Calendar, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResumeTest() {
  const [jobs, setJobs] = useState<JobBlock[]>(emaadResumeBlocks);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('overview');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [componentFocus, setComponentFocus] = useState<ComponentFocus | null>(null);
  const [editValue, setEditValue] = useState('');

  const selectedBlock = jobs.find((job) => job.id === selectedBlockId);

  // OVERVIEW LEVEL - All job blocks
  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Editor</h1>
        <p className="text-muted-foreground">Click any job block to edit</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedBlockId(job.id);
              setZoomLevel('block');
            }}
          >
            <Card className="border-4 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300 bg-card">
              <CardContent className="p-6">
                {/* Lego-style header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{job.company}</h3>
                    <p className="text-sm font-medium text-primary">{job.title}</p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{job.dateRange}</span>
                  </div>
                </div>

                {/* Preview bullets */}
                <div className="space-y-2 border-t border-border pt-4">
                  {job.bullets.slice(0, 2).map((bullet) => (
                    <div key={bullet.id} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      <p className="line-clamp-1">{bullet.text}</p>
                    </div>
                  ))}
                  {job.bullets.length > 2 && (
                    <p className="text-xs text-primary font-medium">
                      +{job.bullets.length - 2} more bullets
                    </p>
                  )}
                </div>

                {/* Click indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                  <span className="font-medium">Click to edit</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // BLOCK LEVEL - All components in one job
  const renderBlock = () => {
    if (!selectedBlock) return null;

    const zoomToComponent = (type: ComponentFocus['componentType'], componentId?: string) => {
      const focus: ComponentFocus = { blockId: selectedBlock.id, componentType: type };
      if (componentId) focus.componentId = componentId;
      
      setComponentFocus(focus);
      setZoomLevel('component');

      // Set initial edit value
      switch (type) {
        case 'company':
          setEditValue(selectedBlock.company);
          break;
        case 'title':
          setEditValue(selectedBlock.title);
          break;
        case 'location':
          setEditValue(selectedBlock.location);
          break;
        case 'date':
          setEditValue(selectedBlock.dateRange);
          break;
        case 'bullet':
          const bullet = selectedBlock.bullets.find((b) => b.id === componentId);
          setEditValue(bullet?.text || '');
          break;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Edit Job Components</h2>
            <p className="text-muted-foreground">Click any component to edit it individually</p>
          </div>

          <div className="space-y-4">
            {/* Company */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => zoomToComponent('company')}
              className="cursor-pointer"
            >
              <Card className="border-4 border-border hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">COMPANY</p>
                      <p className="text-lg font-bold text-foreground">{selectedBlock.company}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Title */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => zoomToComponent('title')}
              className="cursor-pointer"
            >
              <Card className="border-4 border-border hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">JOB TITLE</p>
                      <p className="text-lg font-bold text-primary">{selectedBlock.title}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location & Date */}
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => zoomToComponent('location')}
                className="cursor-pointer"
              >
                <Card className="border-4 border-border hover:border-secondary hover:bg-secondary/5 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">LOCATION</p>
                        <p className="font-semibold text-foreground">{selectedBlock.location}</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => zoomToComponent('date')}
                className="cursor-pointer"
              >
                <Card className="border-4 border-border hover:border-secondary hover:bg-secondary/5 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">DATE RANGE</p>
                        <p className="font-semibold text-foreground">{selectedBlock.dateRange}</p>
                      </div>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bullets */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">BULLET POINTS</h3>
              <div className="space-y-3">
                {selectedBlock.bullets.map((bullet, index) => (
                  <motion.div
                    key={bullet.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => zoomToComponent('bullet', bullet.id)}
                    className="cursor-pointer"
                  >
                    <Card className="border-4 border-border hover:border-chart-3 hover:bg-chart-3/5 transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <p className="flex-1 text-sm text-foreground">{bullet.text}</p>
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // COMPONENT LEVEL - Edit single component
  const renderComponent = () => {
    if (!componentFocus || !selectedBlock) return null;

    const getComponentLabel = () => {
      switch (componentFocus.componentType) {
        case 'company': return 'Company Name';
        case 'title': return 'Job Title';
        case 'location': return 'Location';
        case 'date': return 'Date Range';
        case 'bullet': return 'Bullet Point';
        default: return 'Component';
      }
    };

    const saveChanges = () => {
      setJobs(jobs.map((job) => {
        if (job.id !== selectedBlock.id) return job;

        switch (componentFocus.componentType) {
          case 'company':
            return { ...job, company: editValue };
          case 'title':
            return { ...job, title: editValue };
          case 'location':
            return { ...job, location: editValue };
          case 'date':
            return { ...job, dateRange: editValue };
          case 'bullet':
            return {
              ...job,
              bullets: job.bullets.map((b) =>
                b.id === componentFocus.componentId ? { ...b, text: editValue } : b
              ),
            };
          default:
            return job;
        }
      }));
      setZoomLevel('block');
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="flex h-full items-center justify-center p-8"
      >
        <div className="w-full max-w-3xl">
          <Card className="border-4 border-primary shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Edit {getComponentLabel()}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedBlock.company} - {selectedBlock.title}
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">
                  {getComponentLabel()}
                </label>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full rounded-lg border-2 border-border bg-background p-4 text-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[200px] font-sans"
                  autoFocus
                  placeholder={`Enter ${getComponentLabel().toLowerCase()}...`}
                />

                <div className="flex gap-3 pt-4">
                  <Button onClick={saveChanges} size="lg" className="flex-1">
                    Save Changes
                  </Button>
                  <Button onClick={() => setZoomLevel('block')} variant="outline" size="lg" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </Link>
            {zoomLevel !== 'overview' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (zoomLevel === 'component') {
                    setZoomLevel('block');
                  } else if (zoomLevel === 'block') {
                    setZoomLevel('overview');
                    setSelectedBlockId(null);
                  }
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              {zoomLevel === 'overview' && <span>All Jobs</span>}
              {zoomLevel === 'block' && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span>{selectedBlock?.company}</span>
                </>
              )}
              {zoomLevel === 'component' && componentFocus && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span>{selectedBlock?.company}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="capitalize">{componentFocus.componentType}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Level: {zoomLevel === 'overview' ? '1' : zoomLevel === 'block' ? '2' : '3'}/3
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {zoomLevel === 'overview' && <div key="overview">{renderOverview()}</div>}
          {zoomLevel === 'block' && <div key="block">{renderBlock()}</div>}
          {zoomLevel === 'component' && <div key="component">{renderComponent()}</div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
