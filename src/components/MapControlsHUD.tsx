import React from 'react';
import { Plus, Minus, Target, Layers, Eye } from 'lucide-react';
import { MapLayerStyle } from '../types/navigation';

interface MapControlsHUDProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterVehicle: () => void;
  mapLayer: MapLayerStyle;
  onChangeMapLayer: (layer: MapLayerStyle) => void;
  is3dView: boolean;
  onToggle3dView: () => void;
}

export const MapControlsHUD: React.FC<MapControlsHUDProps> = ({
  onZoomIn,
  onZoomOut,
  onCenterVehicle,
  mapLayer,
  onChangeMapLayer,
  is3dView,
  onToggle3dView,
}) => {
  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      {/* Zoom & Center Controls Cluster */}
      <div className="aura-glass rounded-xl p-1 shadow-2xl flex flex-col gap-1 border border-cyan-500/20">
        <button
          onClick={onZoomIn}
          className="p-2.5 rounded-lg hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Przybliż Mapę (+)"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={onZoomOut}
          className="p-2.5 rounded-lg hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-400 transition-colors border-t border-slate-800"
          title="Oddal Mapę (-)"
        >
          <Minus className="w-5 h-5" />
        </button>

        <button
          onClick={onCenterVehicle}
          className="p-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors border-t border-slate-800 aura-glow-cyan"
          title="Wyśrodkuj na Pojazd"
        >
          <Target className="w-5 h-5" />
        </button>
      </div>

      {/* Map Layer Switcher & Perspective Controls */}
      <div className="aura-glass rounded-xl p-1 shadow-2xl flex flex-col gap-1 border border-cyan-500/20">
        <button
          onClick={() => {
            const layers: MapLayerStyle[] = ['dark', 'satellite', 'street'];
            const nextIdx = (layers.indexOf(mapLayer) + 1) % layers.length;
            onChangeMapLayer(layers[nextIdx]);
          }}
          className="p-2.5 rounded-lg hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center relative"
          title={`Warstwa Mapy: ${mapLayer}`}
        >
          <Layers className="w-5 h-5 text-violet-400" />
          <span className="absolute -bottom-1 text-[8px] font-mono font-bold uppercase text-cyan-400">
            {mapLayer.substring(0, 3)}
          </span>
        </button>

        <button
          onClick={onToggle3dView}
          className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${
            is3dView
              ? 'bg-violet-600/40 text-violet-300 border border-violet-500/40'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Przełącz Perspektywę 2D / 3D HUD"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
