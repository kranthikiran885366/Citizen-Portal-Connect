import { useState } from "react";
import Layout from "@/components/Layout";
import { officers } from "@/lib/data";
import { Search, Plus, Edit, Trash2, Star } from "lucide-react";

export default function AdminOfficers() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newOfficer, setNewOfficer] = useState({ name: "", department: "", designation: "" });

  const filtered = officers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Officer Management</h2>
            <p className="text-sm text-muted-foreground">{officers.length} officers registered</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-add-officer"
          >
            <Plus className="h-4 w-4" />
            Add Officer
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search officers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search"
          />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Officer</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Department</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Assigned</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Resolved</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Pending</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Rating</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((officer) => (
                  <tr key={officer.id} className="hover:bg-muted/20 transition-colors" data-testid={`officer-row-${officer.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {officer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{officer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{officer.department}</td>
                    <td className="px-4 py-3 text-center font-medium">{officer.assigned}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green-600 font-medium">{officer.resolved}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-medium ${officer.pending > 3 ? "text-red-500" : "text-yellow-600"}`}>
                        {officer.pending}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{officer.rating}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" data-testid={`edit-officer-${officer.id}`}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-500" data-testid={`delete-officer-${officer.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Add New Officer</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground text-xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={newOfficer.name} onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })} data-testid="input-new-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={newOfficer.department} onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })} data-testid="input-new-dept" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Designation</label>
                <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={newOfficer.designation} onChange={(e) => setNewOfficer({ ...newOfficer, designation: e.target.value })} data-testid="input-new-designation" />
              </div>
            </div>
            <button
              onClick={() => setShowAdd(false)}
              className="mt-4 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-save-officer"
            >
              Add Officer
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
