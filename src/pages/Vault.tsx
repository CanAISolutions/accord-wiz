import { useEffect, useState } from 'react';
import { listDrafts, saveDraft, deleteDraft, renameDraft, exportDrafts, importDrafts, type Draft } from '@/lib/drafts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Vault = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => setDrafts(listDrafts()), []);

  const handleDuplicate = (d: Draft) => {
    saveDraft(d.name + ' (copy)', d.data);
    setDrafts(listDrafts());
  };

  const handleRename = (d: Draft, name: string) => {
    renameDraft(d.id, name);
    setDrafts(listDrafts());
  };

  const handleDelete = (d: Draft) => {
    deleteDraft(d.id);
    setDrafts(listDrafts());
  };

  const handleExport = () => {
    const blob = new Blob([exportDrafts()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canai-drafts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;
    const text = await file.text();
    importDrafts(text);
    setDrafts(listDrafts());
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">My Drafts</h1>
          <div className="flex items-center gap-2">
            <Input type="file" accept="application/json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button variant="outline" onClick={handleImport} disabled={!file}>Import</Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {drafts.map((d) => (
            <Card key={d.id} className="bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Input defaultValue={d.name} onBlur={(e) => handleRename(d, e.target.value)} />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Button onClick={() => (window.location.href = '/wizard')}>Open</Button>
                <Button variant="outline" onClick={() => handleDuplicate(d)}>Duplicate</Button>
                <Button variant="destructive" onClick={() => handleDelete(d)}>Delete</Button>
                <span className="text-xs text-muted-foreground ml-auto">Updated {new Date(d.updatedAt).toLocaleString()}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vault;


