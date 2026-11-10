import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Terminal,
  Layers,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  Table,
  Key,
  Link,
  Code,
  ShieldCheck,
  Zap,
  Info,
  Copy,
} from 'lucide-react';
import {
  DBMS_ERD_ENTITIES,
  DBMS_SQL_QUERIES,
  NORMALIZATION_STAGES,
  SqlQueryExample,
} from '../../data/dbmsAcademicData';
import { useToast } from '../ui/Toast';

export const DbmsExplorer: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'queries' | 'erd' | 'normalization' | 'dictionary'>('queries');
  const [selectedQuery, setSelectedQuery] = useState<SqlQueryExample>(DBMS_SQL_QUERIES[0]);
  const [editableSql, setEditableSql] = useState<string>(DBMS_SQL_QUERIES[0].sql);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [queryExecutionStats, setQueryExecutionStats] = useState<{ time: number; rowCount: number } | null>(null);

  const handleSelectQuery = (q: SqlQueryExample) => {
    setSelectedQuery(q);
    setEditableSql(q.sql);
    setQueryExecutionStats(null);
  };

  const handleRunQuery = () => {
    setIsRunningQuery(true);
    setQueryExecutionStats(null);

    setTimeout(() => {
      setIsRunningQuery(false);
      setQueryExecutionStats({
        time: selectedQuery.executionTimeMs,
        rowCount: selectedQuery.rows.length,
      });
      showToast('Query Executed Successfully', `Execution time: ${selectedQuery.executionTimeMs} ms • ${selectedQuery.rows.length} rows returned.`, 'success');
    }, 450);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(editableSql);
    showToast('SQL Copied', 'Query copied to clipboard.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Academic Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600/40 text-purple-200 border border-purple-400/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                MSBTE Diploma Capstone Module
              </span>
              <span className="bg-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono">
                foodieexpress_db
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Relational Database Management System (DBMS) Demonstration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Interactive laboratory demonstrating 3NF Normalization, Entity-Relationship (ER) modeling, complex multi-table joins, views, triggers, and ACID transactions engine.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold uppercase text-purple-300 tracking-wider">
                Storage Engine
              </span>
              <p className="text-sm font-black text-white">PostgreSQL / MySQL 3NF</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                ACID Safety
              </span>
              <p className="text-sm font-black text-white">Serializable Locks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('queries')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm whitespace-nowrap transition ${
            activeTab === 'queries'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interactive SQL Query Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('erd')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm whitespace-nowrap transition ${
            activeTab === 'erd'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Entity-Relationship (ER) Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('normalization')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm whitespace-nowrap transition ${
            activeTab === 'normalization'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3NF Normalization Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm whitespace-nowrap transition ${
            activeTab === 'dictionary'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Data Dictionary & Schema</span>
        </button>
      </div>

      {/* TAB 1: Interactive SQL Query Runner */}
      {activeTab === 'queries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Query Selector List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              DBMS Syllabus Scenarios
            </h3>

            <div className="space-y-2">
              {DBMS_SQL_QUERIES.map((q) => {
                const isSelected = selectedQuery.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelectQuery(q)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition text-xs space-y-1 ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">~{q.executionTimeMs} ms</span>
                    </div>
                    <h4 className="font-bold text-slate-900 leading-snug">{q.title}</h4>
                    <p className="text-slate-500 line-clamp-2 leading-relaxed text-[11px]">
                      {q.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SQL Editor & Live Tabular Output (Right 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Editor Container */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
              {/* Terminal Top Bar */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    foodieexpress_db &gt; {selectedQuery.category.toLowerCase()}.sql
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                    title="Copy SQL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleRunQuery}
                    disabled={isRunningQuery}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRunningQuery ? 'Executing...' : 'Run Query'}</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="p-4 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto">
                <textarea
                  rows={8}
                  value={editableSql}
                  onChange={(e) => setEditableSql(e.target.value)}
                  className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-hidden resize-none selection:bg-purple-800"
                  spellCheck={false}
                />
              </div>

              {/* DBMS Rationale Footer */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-purple-300">Relational Explanation:</span>{' '}
                  {selectedQuery.explanation}
                </p>
              </div>
            </div>

            {/* Live Result Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Query Execution Result</h4>
                  <p className="text-[11px] text-slate-400">
                    Simulated execution over FoodieExpress production schema
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-500">
                    Rows: <span className="font-bold text-slate-900">{selectedQuery.rows.length}</span>
                  </span>
                  <span className="text-emerald-600 font-bold">
                    ⚡ {queryExecutionStats ? queryExecutionStats.time : selectedQuery.executionTimeMs} ms
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 sticky top-0">
                    <tr>
                      {selectedQuery.columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-4 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedQuery.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition font-mono text-[11px]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-4">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Entity-Relationship Diagram (ERD) */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Conceptual & Logical Entity-Relationship (ER) Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Normalized entities, primary key identities, foreign key constraints, and relational cardinalities (1:N, M:N).
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              8 Core Relational Tables
            </span>
          </div>

          {/* ERD Entity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DBMS_ERD_ENTITIES.map((ent) => (
              <div
                key={ent.tableName}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Entity Header */}
                <div className={`p-4 bg-gradient-to-r ${ent.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black tracking-wide">{ent.name}</span>
                    <span className="font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded">
                      {ent.tableName}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80 font-mono mt-1">
                    PK: {ent.primaryKey}
                  </p>
                </div>

                {/* Attributes List */}
                <div className="p-4 space-y-2 text-xs flex-1">
                  {ent.attributes.map((attr, aIdx) => {
                    const isPk = attr.constraints.includes('PK');
                    const isFk = attr.constraints.includes('FK');

                    return (
                      <div
                        key={aIdx}
                        className="flex items-center justify-between font-mono text-[11px] py-1 border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isPk && <Key className="w-3 h-3 text-amber-500 shrink-0" />}
                          {isFk && <Link className="w-3 h-3 text-blue-500 shrink-0" />}
                          <span className={isPk ? 'font-bold text-slate-900' : 'text-slate-700'}>
                            {attr.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{attr.type}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Foreign Key References footer */}
                {ent.foreignKeys.length > 0 && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10px] font-mono text-slate-500 space-y-0.5">
                    {ent.foreignKeys.map((fk, fIdx) => (
                      <p key={fIdx} className="truncate">
                        → {fk.field} 🔗 {fk.references}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Relational Cardinality Explanation */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Key Relational Cardinalities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="font-bold text-slate-800">1:N (Users → Orders)</span>
                <p className="text-[11px] text-slate-500">
                  One customer can place many orders over time, but each order is strictly owned by one customer.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="font-bold text-slate-800">1:N (Restaurants → FoodItems)</span>
                <p className="text-[11px] text-slate-500">
                  One kitchen publishes a catalog of menu dishes, linked via restaurant_id.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="font-bold text-slate-800">M:N (Orders ↔ FoodItems)</span>
                <p className="text-[11px] text-slate-500">
                  Resolved via junction table `order_items` storing item_id, quantity, and unit price snapshot.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3NF Normalization Breakdown */}
      {activeTab === 'normalization' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Database Normalization (UNF → 1NF → 2NF → 3NF)
              </h3>
              <p className="text-xs text-slate-500">
                Step-by-step mathematical decomposition of FoodieExpress schema to eliminate anomalies.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {NORMALIZATION_STAGES.map((norm, nIdx) => (
              <div
                key={nIdx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                    {nIdx + 1}
                  </span>
                  <h4 className="font-black text-base text-slate-900">{norm.stage}</h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{norm.description}</p>

                {norm.badExample && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl font-mono text-[11px] text-rose-800">
                    <span className="font-bold">Unnormalized schema:</span> {norm.badExample}
                    <p className="mt-1 text-[10px] text-rose-600">{norm.flaws}</p>
                  </div>
                )}

                {norm.transformation && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-[11px] text-emerald-800">
                    <span className="font-bold">Normalization transformation:</span> {norm.transformation}
                  </div>
                )}

                {norm.outcome && (
                  <p className="text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">Anomalies Resolved:</span> {norm.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Data Dictionary & Specifications */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Production Data Dictionary & Table Specifications
              </h3>
              <p className="text-xs text-slate-500">
                Field names, data types, nullability constraints, and relational keys.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {DBMS_ERD_ENTITIES.map((table) => (
              <div
                key={table.tableName}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{table.tableName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({table.name})</span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Primary Key: {table.primaryKey}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 font-mono">
                      <tr>
                        <th className="py-2.5 px-4">Column Name</th>
                        <th className="py-2.5 px-4">Data Type</th>
                        <th className="py-2.5 px-4">Constraints & Rules</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {table.attributes.map((col, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-4 font-bold text-slate-900">{col.name}</td>
                          <td className="py-2 px-4 text-purple-700">{col.type}</td>
                          <td className="py-2 px-4 text-slate-500">{col.constraints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
