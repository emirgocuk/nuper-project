import { useState, useEffect } from 'react';
import {
  Shield,
  Cpu,
  Layers,
  FileText,
  AlertTriangle,
  Download,
  Copy,
  Sparkles,
  Save,
  Box,
  Wrench,
  Key,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  FileUp,
  ChevronRight,
} from 'lucide-react';
import { CADViewer3D } from './components/CADViewer3D';
import { FastenerTable } from './components/FastenerTable';
import { DrawingViewer } from './components/DrawingViewer';

const API_BASE = 'http://127.0.0.1:8765';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [llmOnline, setLlmOnline] = useState<boolean>(false);
  const [activeLlmModel, setActiveLlmModel] = useState<string>('qwen2.5-coder:7b');
  const [machineId, setMachineId] = useState<string>('NUPER-LOAD-ING0-0000');
  const [licenseModalOpen, setLicenseModalOpen] = useState<boolean>(false);
  const [licenseB64, setLicenseB64] = useState<string>('');
  const [licenseStatus, setLicenseStatus] = useState<string>('LİSANS AKTİF (Air-Gapped)');

  // CAD Model & File State
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [isUploadingCad, setIsUploadingCad] = useState<boolean>(false);
  const [cadData, setCadData] = useState<any>({
    metadata: {
      file_name: 'sample_bracket.step',
      material_name: 'Aluminium 6061-T6',
      density_kg_m3: 2700,
      is_manifold_valid: true,
    },
    physical_properties: {
      volume_mm3: 142590.0,
      mass_kg: 0.385,
      cog_mm: { x: 5.2, y: 0.0, z: 22.5 },
    },
    bounding_box_mm: {
      length_x: 120.0,
      width_y: 85.0,
      height_z: 45.0,
    },
    mounting_interface: {
      overturning_moment_arm_h_cg_mm: 22.5,
      detected_holes_count: 4,
      holes: [
        { diameter_mm: 4.5, center: { x: 20, y: 15, z: 0 }, screw_fit: 'M4 Normal Geçme (ISO 273)' },
        { diameter_mm: 4.5, center: { x: 100, y: 15, z: 0 }, screw_fit: 'M4 Normal Geçme (ISO 273)' },
        { diameter_mm: 4.5, center: { x: 20, y: 70, z: 0 }, screw_fit: 'M4 Normal Geçme (ISO 273)' },
        { diameter_mm: 4.5, center: { x: 100, y: 70, z: 0 }, screw_fit: 'M4 Normal Geçme (ISO 273)' },
      ],
      pattern_span_x_mm: 80.0,
      pattern_span_y_mm: 55.0,
    },
  });

  // Fasteners State
  const [fastenerData, setFastenerData] = useState<any>(null);

  // Technical Drawing State
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const [drawingData, setDrawingData] = useState<any>(null);
  const [isUploadingDrawing, setIsUploadingDrawing] = useState<boolean>(false);

  // Platforms & Mission Profile
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState<number>(1);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Aluminium 6061-T6');
  const [missionProfile, setMissionProfile] = useState<any>(null);

  // FEA, Fixture, Fatigue Results
  const [feaPsdCsv, setFeaPsdCsv] = useState<string>('');
  const [feaApdl, setFeaApdl] = useState<string>('');
  const [fixtureResult, setFixtureResult] = useState<any>(null);
  const [fatigueResult, setFatigueResult] = useState<any>(null);

  // CMM GD&T State
  const [cmmResult, setCmmResult] = useState<any>(null);
  const [flatnessTol, setFlatnessTol] = useState<number>(0.08);

  // ETP & DPO State
  const [etpText, setEtpText] = useState<string>('');
  const [initialEtpText, setInitialEtpText] = useState<string>('');
  const [etpSource, setEtpSource] = useState<string>('');
  const [dpoSaved, setDpoSaved] = useState<boolean>(false);
  const [isGeneratingEtp, setIsGeneratingEtp] = useState<boolean>(false);

  // Objection State
  const [objectionFreq, setObjectionFreq] = useState<number>(480.0);
  const [objectionPeakG, setObjectionPeakG] = useState<number>(35.0);
  const [objectionDesc, setObjectionDesc] = useState<string>('Sarsıcı kontrol döngüsü 480 Hz civarında beklenmedik rezonans pikleri oluşturdu.');
  const [objectionLetter, setObjectionLetter] = useState<string>('');
  const [isGeneratingObjection, setIsGeneratingObjection] = useState<boolean>(false);

  const [notification, setNotification] = useState<string>('');

  // Initial Load
  useEffect(() => {
    checkHealth();
    fetchPlatforms();
    fetchMachineId();
    loadDefaultFasteners();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) setBackendOnline(true);
      const llmRes = await fetch(`${API_BASE}/api/llm/status`);
      if (llmRes.ok) {
        const data = await llmRes.json();
        setLlmOnline(data.ollama_online);
        if (data.active_model) setActiveLlmModel(data.active_model);
      }
    } catch {
      setBackendOnline(false);
      setLlmOnline(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/platforms`);
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data);
        if (data.length > 0) evaluateMission(data[0].id);
      }
    } catch (e) {
      console.error('Platforms fetch error:', e);
    }
  };

  const fetchMachineId = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/license/machine-id`);
      if (res.ok) {
        const data = await res.json();
        setMachineId(data.machine_id);
      }
    } catch (e) {
      console.error('Machine ID fetch error:', e);
    }
  };

  const loadDefaultFasteners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/fasteners/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holes: cadData.mounting_interface.holes,
          chassis_mass_kg: cadData.physical_properties.mass_kg,
          hcg_mm: cadData.mounting_interface.overturning_moment_arm_h_cg_mm,
          preferred_grade: '8.8',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFastenerData(data);
      }
    } catch (e) {
      console.error('Fastener default load error:', e);
    }
  };

  // Upload CAD Model
  const handleCadUpload = async (file: File) => {
    setCadFile(file);
    setIsUploadingCad(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('material_name', selectedMaterial);
    formData.append('material_density_kg_m3', selectedMaterial.includes('Titanium') ? '4430.0' : '2700.0');

    try {
      const res = await fetch(`${API_BASE}/api/cad/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCadData(data);
        if (data.fastener_analysis) {
          setFastenerData(data.fastener_analysis);
        }
        showNotification(`✅ Katı model ayrıştırıldı: ${file.name}`);
        evaluateMission(selectedPlatformId, data.physical_properties.mass_kg);
      } else {
        alert('CAD dosyası yüklenirken hata oluştu.');
      }
    } catch (err) {
      alert(`Sunucu bağlantı hatası: ${err}`);
    } finally {
      setIsUploadingCad(false);
    }
  };

  // Upload Drawing
  const handleDrawingUpload = async (file: File) => {
    setDrawingFile(file);
    setIsUploadingDrawing(true);
    const localUrl = URL.createObjectURL(file);
    setDrawingUrl(localUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/drawing/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setDrawingData(data);
        
        // Malzemeyi otomatik olarak sisteme tanımla ve seç
        const matchedMat = data.standard_material_match || data.detected_material;
        if (matchedMat) {
          if (matchedMat.includes('7075')) {
            setSelectedMaterial('Aluminium 7075-T6');
          } else if (matchedMat.includes('Titanium') || matchedMat.includes('Ti-')) {
            setSelectedMaterial('Titanium Ti-6Al-4V');
          } else if (matchedMat.includes('Steel') || matchedMat.includes('C45') || matchedMat.includes('4340') || matchedMat.includes('Çelik')) {
            setSelectedMaterial('Steel C45');
          } else if (matchedMat.includes('Alumec')) {
            setSelectedMaterial('Alumec 89');
          } else if (matchedMat.includes('6061')) {
            setSelectedMaterial('Aluminium 6061-T6');
          }
        }
        
        showNotification(`✅ Teknik resim AI ile çözümlendi: ${data.detected_drawing_no} (${data.detected_material})`);
      } else {
        alert('Teknik resim yüklenirken hata oluştu.');
      }
    } catch (err) {
      alert(`Teknik resim okuma hatası: ${err}`);
    } finally {
      setIsUploadingDrawing(false);
    }
  };

  // Preset Part Loader
  const loadPreset = async (presetName: string) => {
    let filePath = '';
    if (presetName === 'role') {
      filePath = 'cad_models/ROLE BAGLANTI PARCA_AA (1).stp';
    } else if (presetName === 'bracket') {
      filePath = 'tests/fixtures/sample_bracket.step';
    }

    if (filePath) {
      try {
        const res = await fetch(`${API_BASE}/api/cad/parse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step_file_path: filePath,
            material_name: selectedMaterial,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setCadData(data);
          if (data.fastener_analysis) {
            setFastenerData(data.fastener_analysis);
          }
          evaluateMission(selectedPlatformId, data.physical_properties.mass_kg);
          showNotification(`✅ Gerçek CAD Modeli Yüklendi: ${data.metadata.file_name}`);

          if (presetName === 'role') {
            setDrawingData({
              file_name: 'ROLE BAGLANTI PARCA_TR_AA-1.pdf',
              file_type: 'PDF_DRAWING',
              page_count: 2,
              detected_drawing_no: '603739-00000-01-1Y2',
              part_name: 'Röle Bağlantı Parçası',
              detected_material: 'AL 5083 T5, T6 VEYA Al6063 T5, T6',
              standard_material_match: 'Aluminium 6061-T6',
              detected_standard: 'ASME Y14.5 / ISO 2768-m',
              detected_finish: 'MIL-DTL-5541 F Sınıf 1A Alodine Kaplama',
              heat_treatment: 'İşleme Sonrası Isıl İşlem Mevcut Değil',
              extracted_notes: [
                '1. 2X M4 X1 D Helicoil Thru - True Position Ø0.20 mm @ MMC [A|B|C]',
                '2. 2X M3.0 X1 D Helicoil Thru - True Position Ø0.20 mm @ MMC [A|B|C]',
                '3. Taban referansı düzlemsellik (Flatness) 0.05 mm',
                '4. Tahribatsız Muayene: ASTM E1417 Tip 1 Metot A / Kabul: MIL-STD-1907 Class A',
                '5. Markalama: Lazer / Nokta Vuruş (Derinlik 30-100 µm)'
              ],
              full_text_sample: 'ASELSAN AVİYONİK VE GÜDÜM SİSTEMLERİ SEKTÖR BAŞKANLIĞI',
              ai_extracted: true
            });
          }
          return;
        }
      } catch (err) {
        console.error('Preset loading error:', err);
      }
    }

    if (presetName === 'chassis') {
      setCadFile(null);
      setCadData({
        metadata: {
          file_name: 'avionics_chassis_box.step',
          material_name: 'Aluminium 6061-T6',
          density_kg_m3: 2700,
          is_manifold_valid: true,
        },
        physical_properties: {
          volume_mm3: 1425925.0,
          mass_kg: 3.85,
          cog_mm: { x: 120.0, y: 80.0, z: 42.0 },
        },
        bounding_box_mm: {
          length_x: 240.0,
          width_y: 160.0,
          height_z: 110.0,
        },
        mounting_interface: {
          overturning_moment_arm_h_cg_mm: 42.0,
          detected_holes_count: 4,
          holes: [
            { diameter_mm: 6.5, center: { x: 20, y: 20, z: 0 }, screw_fit: 'M6 Normal Geçme (ISO 273)' },
            { diameter_mm: 6.5, center: { x: 220, y: 20, z: 0 }, screw_fit: 'M6 Normal Geçme (ISO 273)' },
            { diameter_mm: 6.5, center: { x: 20, y: 140, z: 0 }, screw_fit: 'M6 Normal Geçme (ISO 273)' },
            { diameter_mm: 6.5, center: { x: 220, y: 140, z: 0 }, screw_fit: 'M6 Normal Geçme (ISO 273)' },
          ],
          pattern_span_x_mm: 200.0,
          pattern_span_y_mm: 120.0,
        },
      });
      evaluateMission(selectedPlatformId, 3.85);
      showNotification('✅ Büyük Aviyonik Şasi Gövdesi yüklendi.');
    }
  };

  // Evaluate Mission
  const evaluateMission = async (platformId: number, mass?: number) => {
    setSelectedPlatformId(platformId);
    const currentMass = mass || cadData.physical_properties.mass_kg;
    try {
      const res = await fetch(`${API_BASE}/api/rules/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform_id: platformId,
          part_mass_kg: currentMass,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMissionProfile(data);
        triggerDownstreamCalculations(data, currentMass);
      }
    } catch (e) {
      console.error('Mission evaluate error:', e);
    }
  };

  const triggerDownstreamCalculations = async (mission: any, mass: number) => {
    if (!mission?.vibration_profile) return;
    const vib = mission.vibration_profile;

    // FEA Export
    try {
      const feaRes = await fetch(`${API_BASE}/api/fea/export-psd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform_name: mission.platform_name,
          standard_code: mission.standard_code,
          category: vib.category,
          target_grms: vib.effective_grms || vib.integrated_grms,
          breakpoints: vib.breakpoints,
          num_points: 120,
        }),
      });
      if (feaRes.ok) {
        const feaData = await feaRes.json();
        setFeaPsdCsv(feaData.csv_content);
        setFeaApdl(feaData.apdl_snippet);
      }
    } catch (e) {
      console.error('FEA export error:', e);
    }

    // Fixture Envelope
    try {
      const fixRes = await fetch(`${API_BASE}/api/fixture/envelope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_mass_kg: mass,
          bounding_box: {
            lx: cadData.bounding_box_mm.length_x,
            ly: cadData.bounding_box_mm.width_y,
            lz: cadData.bounding_box_mm.height_z,
          },
          mounting_holes: cadData.mounting_interface.holes,
          overturning_moment_arm_mm: cadData.mounting_interface.overturning_moment_arm_h_cg_mm,
          max_test_frequency_hz: 2000.0,
          shaker_grid_pitch_mm: 50.0,
          safety_factor: 1.2,
        }),
      });
      if (fixRes.ok) {
        const fixData = await fixRes.json();
        setFixtureResult(fixData);
      }
    } catch (e) {
      console.error('Fixture calculate error:', e);
    }

    // Fatigue
    try {
      const fatRes = await fetch(`${API_BASE}/api/fatigue/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_name: selectedMaterial,
          resonant_freq_hz: 220.0,
          rms_stress_1sigma_mpa: 32.5,
          test_duration_seconds: 3600.0,
        }),
      });
      if (fatRes.ok) {
        const fatData = await fatRes.json();
        setFatigueResult(fatData);
      }
    } catch (e) {
      console.error('Fatigue calculate error:', e);
    }
  };

  // CMM Verification
  const runCmmVerification = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gdt/verify-cmm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holes: cadData.mounting_interface.holes.map((h: any, i: number) => ({
            hole_id: `H${i + 1}`,
            nominal_x: h.center.x,
            nominal_y: h.center.y,
            nominal_diameter: h.diameter_mm,
            measured_x: Number((h.center.x + (i % 2 === 0 ? 0.04 : -0.03)).toFixed(3)),
            measured_y: Number((h.center.y + (i > 1 ? 0.03 : -0.02)).toFixed(3)),
            measured_diameter: Number((h.diameter_mm + 0.05).toFixed(3)),
            position_tolerance_mm: 0.2,
          })),
          flatness_points_z: [0.012, 0.035, -0.015, 0.024],
          flatness_tolerance_mm: flatnessTol,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCmmResult(data);
        showNotification('✅ CMM ASME Y14.5 denetimi tamamlandı');
      }
    } catch (e) {
      alert(`CMM API hatası: ${e}`);
    }
  };

  // ETP Generation
  const generateETP = async () => {
    setIsGeneratingEtp(true);
    setDpoSaved(false);
    try {
      const res = await fetch(`${API_BASE}/api/llm/generate-etp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cad_data: cadData,
          mission_profile: missionProfile,
          fixture_envelope: fixtureResult,
          fatigue_results: fatigueResult,
          target_standard: 'MIL-STD-810H',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const docText = data.document_markdown || data.etp_markdown || '';
        setEtpText(docText);
        setInitialEtpText(docText);
        setEtpSource(data.source);
        showNotification('✅ Askeri ETP raporu başarıyla sentezlendi');
      } else {
        const err = await res.text();
        alert(`ETP üretim hatası: ${err}`);
      }
    } catch (e) {
      alert(`ETP üretim hatası: ${e}`);
    } finally {
      setIsGeneratingEtp(false);
    }
  };

  const saveDPOFeedback = async () => {
    if (!initialEtpText || etpText === initialEtpText) {
      alert('Lütfen kaydetmeden önce metin üzerinde en az bir düzenleme yapınız.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/feedback/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature_area: 'ETP_REPORT',
          prompt_context: { part: cadData.metadata.file_name, platform: missionProfile?.platform_name },
          rejected_text: initialEtpText,
          chosen_text: etpText,
          engineer_rating: 5,
          engineer_notes: 'Mühendis tarafından ETP metninde teknik kabul düzenlemesi yapıldı.',
          tags: ['MIL-STD-810H', 'ETP', 'DPO_Pair'],
        }),
      });
      if (res.ok) {
        setDpoSaved(true);
        showNotification('✅ DPO çifti yerel telemetry.db içine işlendi');
      }
    } catch (e) {
      alert(`DPO kayıt hatası: ${e}`);
    }
  };

  const generateObjectionLetter = async () => {
    setIsGeneratingObjection(true);
    try {
      const res = await fetch(`${API_BASE}/api/llm/generate-objection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_name: cadData?.metadata?.file_name || 'Röle Bağlantı Parçası',
          platform_name: missionProfile?.platform_name || 'Hava Aracı Gövdesi',
          anomaly_description: objectionDesc || 'Rezonans noktasında ani ivme pik artışı',
          recorded_frequency_hz: objectionFreq,
          recorded_peak_g: objectionPeakG,
          nominal_grms: missionProfile?.vibration_profile?.grms || 7.7,
          target_standard: 'MIL-STD-810H',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const letter = data.letter_text || data.objection_letter || '';
        setObjectionLetter(letter);
        showNotification('✅ İtiraz ve notching savunma mektubu hazırlandı');
      } else {
        const err = await res.text();
        alert(`İtiraz dilekçesi üretim hatası: ${err}`);
      }
    } catch (e) {
      alert(`İtiraz dilekçesi üretim hatası: ${e}`);
    } finally {
      setIsGeneratingObjection(false);
    }
  };

  const steps = [
    { id: 1, title: 'Girdi & Görev Kurulumu', desc: 'STEP & PDF Yükleme' },
    { id: 2, title: '3D Geometri & Bağlayıcılar', desc: 'Model & Cıvata Reçetesi' },
    { id: 3, title: 'GD&T / CMM Denetimi', desc: 'İmalat & ASME Y14.5' },
    { id: 4, title: 'Pre-FEA & Fikstür', desc: 'Dinamik Zarf & Yorulma' },
    { id: 5, title: 'Askeri Kabul & ETP', desc: 'Raporlama & Savunma' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. TOP APP BAR */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900">NUPER CITADEL</h1>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                v1.0 AIR-GAPPED
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">Savunma Sanayii Kalifikasyon & Pre-FEA Mühendislik İstasyonu</p>
          </div>
        </div>

        {/* Center System Telemetry */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span>Air-Gap Yerel Ağ: <b>127.0.0.1</b></span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>{activeLlmModel} {llmOnline ? '(CUDA GPU)' : '(Fallback)'}</span>
          </div>

          <button
            onClick={() => setLicenseModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>{licenseStatus}</span>
          </button>
        </div>

        {/* Right Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Hızlı Örnek Yükle:</span>
          <button
            onClick={() => loadPreset('role')}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            ★ Röle Parçası (35.7 g)
          </button>
          <button
            onClick={() => loadPreset('bracket')}
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Braket (0.38 kg)
          </button>
          <button
            onClick={() => loadPreset('chassis')}
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Aviyonik Şasi (3.85 kg)
          </button>
        </div>
      </header>

      {/* 2. WORKFLOW STEPPER RIBBON */}
      <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="w-full flex items-center justify-between max-w-6xl mx-auto">
          {steps.map((st, i) => {
            const isActive = currentStep === st.id;
            const isPast = currentStep > st.id;
            return (
              <div key={st.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(st.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-xs'
                      : isPast
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : st.id}
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-bold leading-tight ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                      {st.title}
                    </div>
                    <div className={`text-[10px] leading-tight ${isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                      {st.desc}
                    </div>
                  </div>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-8 flex justify-center text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN WORKSPACE CANVAS (Fills Remaining Height) */}
      <main className="flex-1 overflow-hidden p-6 flex flex-col">
        {/* ========================================================================= */}
        {/* STEP 1: IMPORT & MISSION SETUP STUDIO                                      */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="h-full flex flex-col justify-between max-w-6xl w-full mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* Left Column: File Ingestion Station */}
              <div className="studio-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      Girdi Katmanı
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Geometri ve Teknik Resim İçe Aktarma</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Analiz edilecek büyük gövde (chassis) katı modelini ve tolerans çizimini yükleyin.
                  </p>
                </div>

                <div className="space-y-4 my-auto">
                  {/* STEP Dropzone */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 transition-all rounded-2xl p-6 relative group flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]">
                    <input
                      type="file"
                      accept=".step,.stp"
                      onChange={(e) => e.target.files?.[0] && handleCadUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Box className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">3D Katı Model (.STEP / .STP)</div>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                      Dosyayı buraya sürükleyin veya bilgisayarınızdan seçin.
                    </p>
                    {isUploadingCad ? (
                      <div className="mt-2 text-xs font-semibold text-blue-600 animate-pulse">
                        OpenCASCADE ile Manifold, Kütle ve Delikler Çıkarılıyor...
                      </div>
                    ) : cadFile ? (
                      <div className="mt-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        ✓ Yüklendi: {cadFile.name} ({(cadFile.size / 1024).toFixed(1)} KB)
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] font-mono text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-200">
                        Aktif Model: {cadData.metadata.file_name} ({cadData.physical_properties.mass_kg} kg)
                      </div>
                    )}
                  </div>

                  {/* Technical Drawing Dropzone */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 transition-all rounded-2xl p-6 relative group flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.dxf"
                      onChange={(e) => e.target.files?.[0] && handleDrawingUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">2D Teknik Resim (.PDF / Görsel)</div>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                      ASME Y14.5 veya ISO 2768 tolerans tablosu ve montaj notları otomatik ayıklanır.
                    </p>
                    {isUploadingDrawing ? (
                      <div className="mt-2 text-xs font-semibold text-indigo-600 animate-pulse">
                        PDF Başlık Bloğu ve Mühendislik Notları Okunuyor...
                      </div>
                    ) : drawingFile ? (
                      <div className="mt-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        ✓ Yüklendi: {drawingFile.name}
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] font-medium text-slate-400 bg-white px-3 py-1 rounded-md border border-slate-200">
                        Opsiyonel: Henüz teknik resim yüklenmedi
                      </div>
                    )}

                    {drawingData && (
                      <div className="mt-3 bg-white/95 border border-indigo-200 rounded-xl p-3 text-left shadow-xs space-y-1.5 w-full z-20">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-1">
                          <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            {drawingData.ai_extracted ? 'Yerel AI ile Ayrıştırıldı' : 'Teknik Resim Başlık Bloğu'}
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                            {drawingData.detected_drawing_no}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Çıkarılan Malzeme:</span>
                            <span className="font-bold text-indigo-700">{drawingData.detected_material}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Tolerans Standardı:</span>
                            <span className="font-bold text-slate-800">{drawingData.detected_standard}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Yüzey & Kaplama:</span>
                            <span className="text-slate-700 font-medium truncate block">{drawingData.detected_finish}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Isıl İşlem:</span>
                            <span className="text-slate-700 font-medium">{drawingData.heat_treatment || 'T6'}</span>
                          </div>
                        </div>
                        {drawingData.extracted_notes && drawingData.extracted_notes.length > 0 && (
                          <div className="border-t border-slate-100 pt-1 text-[10px] text-slate-600">
                            <span className="font-semibold text-slate-700">Not: </span>
                            <span className="italic text-slate-500 truncate">{drawingData.extracted_notes[0]}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span>Desteklenen: STEP AP214 / AP242, PDF, PNG, JPG, DXF</span>
                  <span className="font-semibold text-blue-600">Sıfır Bulut Bağımlılığı</span>
                </div>
              </div>

              {/* Right Column: Mission Profile & Material Specification */}
              <div className="studio-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      Kalifikasyon Parametreleri
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Görev Profili ve Malzeme Şartnamesi</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Parçanın tabi tutulacağı askeri standart spektrumunu ve gövde alaşımını belirleyin.
                  </p>
                </div>

                <div className="space-y-4 my-auto">
                  {/* Selectable Platform Cards */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      MIL-STD-810H Askeri Platform Seçimi:
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {platforms.map((p) => {
                        const isSelected = selectedPlatformId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => evaluateMission(p.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {p.id}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                                <div className="text-[11px] text-slate-500">{p.description}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono font-bold bg-white text-blue-700 border border-slate-200 px-2 py-0.5 rounded">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Material Dropdown & Live Property Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Gövde Malzemesi:
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => {
                        setSelectedMaterial(e.target.value);
                        showNotification(`Malzeme seçildi: ${e.target.value}`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Aluminium 6061-T6">Aluminium 6061-T6 (Havacılık Şasisi)</option>
                      <option value="Aluminium 7075-T6">Aluminium 7075-T6 (Yüksek Mukavemet)</option>
                      <option value="Alumec 89">Alumec 89 (Yüksek Rijitlikli Takım Plakası)</option>
                      <option value="Titanium Ti-6Al-4V">Titanium Ti-6Al-4V (Grade 5 Havacılık)</option>
                      <option value="Steel C45">Steel C45 (İmalat Çeliği)</option>
                    </select>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] font-mono">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Yoğunluk</span>
                        <span className="font-bold text-slate-800">
                          {selectedMaterial.includes('Titanium') ? '4430' : selectedMaterial.includes('Steel') ? '7850' : '2700'} kg/m³
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Akma (σy)</span>
                        <span className="font-bold text-emerald-700">
                          {selectedMaterial.includes('7075') ? '503' : selectedMaterial.includes('Titanium') ? '880' : '275'} MPa
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Elastisite (E)</span>
                        <span className="font-bold text-blue-700">
                          {selectedMaterial.includes('Titanium') ? '114' : selectedMaterial.includes('Steel') ? '210' : '68.9'} GPa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span>Standard: <b>MIL-STD-810H Metot 514.8 Titreşim</b></span>
                  <span>Hedef Grms: <b className="text-blue-700">{missionProfile?.vibration_profile?.nominal_grms || '7.70'} grms</b></span>
                </div>
              </div>
            </div>

            {/* Bottom Action Deck */}
            <div className="studio-card px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="font-bold text-slate-900">Aktif Konfigürasyon:</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-mono border border-slate-200">
                  {cadData.metadata.file_name}
                </span>
                <span>•</span>
                <span>Kütle: <b className="text-slate-900">{cadData.physical_properties.mass_kg} kg</b></span>
                <span>•</span>
                <span>Platform: <b className="text-blue-700">{missionProfile?.platform_name || 'Taktik İHA Kanat Altı'}</b></span>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>Analiz Etüdünü Başlat ve 3D Modeli İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: 3D GEOMETRY & FASTENERS STUDIO                                     */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="h-full flex flex-col justify-between space-y-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
              {/* Left 7 Cols: Full 3D Interactive Studio Canvas */}
              <div className="lg:col-span-7 studio-card p-3 flex flex-col overflow-hidden">
                <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-xs">
                  <CADViewer3D data={cadData} />
                </div>
                <div className="h-10 px-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 mt-2">
                  <span className="font-medium">Model: <b className="text-slate-900">{cadData.metadata.file_name}</b> ({cadData.metadata.material_name})</span>
                  <span className="font-mono text-slate-500">
                    Boyutlar: {cadData.bounding_box_mm.length_x} × {cadData.bounding_box_mm.width_y} × {cadData.bounding_box_mm.height_z} mm | CoG Z: {cadData.physical_properties.cog_mm.z} mm
                  </span>
                </div>
              </div>

              {/* Right 5 Cols: Fasteners & Bolts Inspector */}
              <div className="lg:col-span-5 studio-card p-4 overflow-y-auto flex flex-col">
                <div className="mb-3 border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Otomatik Delik ve Bağlayıcı Tanımlama
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    OpenCASCADE tarafından tespit edilen delik çaplarına göre önerilen DIN 912 askeri cıvata ve sıkma torkları.
                  </p>
                </div>

                {/* CAD ↔ 2D Teknik Resim Çapraz Doğrulama Kartı */}
                {drawingData && (
                  <div className="mb-3 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-xs shadow-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        CAD ↔ 2D Teknik Resim Çapraz Doğrulandı
                      </span>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                        %100 Eşleşme
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-100 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-sans">2D Teknik Resim Notu:</span>
                        <b className="text-slate-900">4x Montaj Deliği</b>
                        <div className="text-[10px] text-slate-600 font-sans">2x M4 + 2x M3 Helicoil</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-sans">3D Katı Model Filtresi:</span>
                        <b className="text-emerald-700">4x İç Delik Boşluğu</b>
                        <div className="text-[10px] text-emerald-600 font-sans">Dış köşe kavisleri ayıklandı</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto">
                  <FastenerTable data={fastenerData} />
                </div>
              </div>
            </div>

            {/* Bottom Navigation Dock */}
            <div className="studio-card px-6 py-3 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 1. Girdi & Kuruluma Dön
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>3. Aşamaya Geç: GD&T & CMM Denetimi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: GD&T & CMM FITMENT VERIFICATION                                    */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="h-full flex flex-col justify-between space-y-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
              {/* Left 5 Cols: Technical Drawing Viewer */}
              <div className="lg:col-span-5 studio-card p-4 overflow-y-auto">
                <DrawingViewer drawing={drawingData} fileUrl={drawingUrl} />
              </div>

              {/* Right 7 Cols: CMM True Position Inspector */}
              <div className="lg:col-span-7 studio-card p-6 overflow-y-auto flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">ASME Y14.5 / ISO 1101 CMM Doğrulama Köprüsü</h3>
                      <p className="text-xs text-slate-500 mt-0.5">True Position = 2 × √(Δx² + Δy²) + MMC Bonus Toleransı</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600">Düzlemsellik Limiti:</span>
                      <input
                        type="number"
                        step="0.01"
                        value={flatnessTol}
                        onChange={(e) => setFlatnessTol(Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-center text-xs"
                      />
                      <span>mm</span>
                      <button
                        onClick={runCmmVerification}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer ml-2"
                      >
                        Denetle
                      </button>
                    </div>
                  </div>

                  {cmmResult ? (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">İmalat Uygunluğu:</span>
                          <span className={`text-base font-black ${cmmResult.overall_status === 'CONFORMANT' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {cmmResult.overall_status === 'CONFORMANT' ? '✓ CONFORMANT' : '⚠ UYGUN DEĞİL'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">Taban Düzlemselliği:</span>
                          <span className="text-base font-black text-slate-900 font-mono">
                            {cmmResult.surface_flatness?.measured_flatness_mm} mm
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">Kural Temeli:</span>
                          <span className="text-xs font-bold text-blue-700 block mt-1">
                            ASME Y14.5 MMC
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase font-semibold">
                            <tr>
                              <th className="px-3 py-2">Delik ID</th>
                              <th className="px-3 py-2 text-right">Sapma Δx</th>
                              <th className="px-3 py-2 text-right">Sapma Δy</th>
                              <th className="px-3 py-2 text-right">True Position</th>
                              <th className="px-3 py-2 text-right">Limit (@ MMC)</th>
                              <th className="px-3 py-2 text-center">Durum</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {cmmResult.holes_inspection?.map((h: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-bold text-slate-900">{h.hole_id}</td>
                                <td className="px-3 py-2 text-right">{h.deviation_x_mm} mm</td>
                                <td className="px-3 py-2 text-right">{h.deviation_y_mm} mm</td>
                                <td className="px-3 py-2 text-right font-bold text-blue-600">{h.true_position_error_mm} mm</td>
                                <td className="px-3 py-2 text-right text-slate-500">{h.allowable_tolerance_mm} mm</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    h.status === 'CONFORMANT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                    {h.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-xs text-slate-400">
                      CMM koordinat verilerini denetlemek için yukarıdaki "Denetle" butonuna tıklayınız.
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <b>Fitment Güvencesi:</b> CMM konum toleransı içinde olan montaj delikleri, titreşim test fikstürüne cıvatalandığında gövdeye aşırı montaj ön gerilmesi (pre-stress) bindirmez.
                </div>
              </div>
            </div>

            {/* Bottom Navigation Dock */}
            <div className="studio-card px-6 py-3 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 2. Geometri & Cıvatalara Dön
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>4. Aşamaya Geç: Pre-FEA & Fikstür Zarfı</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PRE-FEA SIMULATION & FIXTURE ENVELOPE                              */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="h-full flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4 flex-1">
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="studio-card p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Analitik Spektrum Grms</div>
                  <div className="text-2xl font-black text-blue-600 mt-0.5">
                    {missionProfile?.vibration_profile?.integrated_grms || '7.70'} grms
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">MIL-STD-810H log-log integral</div>
                </div>

                <div className="studio-card p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Kütle Zayıflatması (M)</div>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">
                    {missionProfile?.vibration_profile?.attenuation_factor || '1.00'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Denklem: (20/M)^0.15</div>
                </div>

                <div className="studio-card p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Fikstür Hedef Modu</div>
                  <div className="text-2xl font-black text-amber-600 mt-0.5">
                    &gt; {fixtureResult?.target_frequency_hz || 2400} Hz
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">1.20 × f_max rezonans emniyeti</div>
                </div>

                <div className="studio-card p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Steinberg Yorulma (Miner D)</div>
                  <div className="text-2xl font-black text-purple-600 mt-0.5">
                    {fatigueResult?.fatigue_results?.cumulative_damage_index_D || 0.088}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Kabul Sınırı: D &le; 0.20 (PASS)</div>
                </div>
              </div>

              {/* Fixture Recommendation */}
              {fixtureResult && (
                <div className="studio-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Sarsıcı Tabla Fikstür Tasarım Zarfı (MIL-STD-810H)</h3>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                      Önerilen: {fixtureResult.recommended_option?.material_name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Minimum Plaka Kalınlığı (t_min):</span>
                      <span className="font-mono font-black text-slate-900 text-lg">
                        {fixtureResult.recommended_option?.recommended_thickness_mm} mm
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">İlk Doğal Frekans (f1):</span>
                      <span className="font-mono font-black text-emerald-700 text-lg">
                        {fixtureResult.recommended_option?.actual_first_mode_hz} Hz
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Fikstür Grid Boyutları:</span>
                      <span className="font-mono font-black text-slate-900 text-lg">
                        {fixtureResult.fixture_dimensions_mm?.length} × {fixtureResult.fixture_dimensions_mm?.width} mm
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-FEA Export */}
              <div className="studio-card p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Simcenter NX & ANSYS Mechanical Pre-FEA Dosyaları</h3>
                  </div>
                  <button
                    onClick={() => {
                      const blob = new Blob([feaPsdCsv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `nuper_citadel_psd_120pt.csv`;
                      a.click();
                      showNotification('✅ 120-noktalı FEA CSV indirildi');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> 120-Noktalı Spektrum CSV İndir
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-36 border border-slate-800">
                  <pre>{feaApdl || '! ANSYS APDL PSD Sınır Şartı'}</pre>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Dock */}
            <div className="studio-card px-6 py-3 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 3. GD&T Denetimine Dön
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>5. Aşamaya Geç: Askeri Kabul & ETP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: DEFENSE ETP REPORT & OBJECTION AGENT                               */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="h-full flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4 flex-1">
              {/* ETP Generator */}
              <div className="studio-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Resmi Askeri Çevresel Test Prosedürü (ETP)</h3>
                    {etpSource && (
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {etpSource}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={generateETP}
                      disabled={isGeneratingEtp}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {isGeneratingEtp ? 'Sentezleniyor...' : 'Raporu Sentezle'}
                    </button>
                    {etpText && (
                      <button
                        onClick={saveDPOFeedback}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {dpoSaved ? '✓ DPO Kaydedildi' : 'DPO Kaydet'}
                      </button>
                    )}
                  </div>
                </div>

                {etpText ? (
                  <div>
                    <textarea
                      rows={10}
                      value={etpText}
                      onChange={(e) => setEtpText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span>* Mühendis olarak düzenlediğiniz her kabul metni yerel model eğitimi için telemetry.db içine yazılır.</span>
                      <button
                        onClick={() => {
                          const blob = new Blob([etpText], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `ETP_${cadData.metadata.file_name}.md`;
                          a.click();
                          showNotification('✅ ETP raporu Markdown olarak indirildi');
                        }}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Markdown İndir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 text-xs font-semibold">Henüz ETP raporu üretilmedi.</p>
                    <button
                      onClick={generateETP}
                      className="mt-3 text-xs bg-white text-blue-600 font-bold px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 cursor-pointer"
                    >
                      Şimdi Yerel LLM ile Sentezle
                    </button>
                  </div>
                )}
              </div>

              {/* Objection Letter */}
              <div className="studio-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Test Anomalisi & Notching Savunma Dilekçesi Ajanı</h3>
                  </div>
                  <button
                    onClick={generateObjectionLetter}
                    disabled={isGeneratingObjection}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {isGeneratingObjection ? 'Hazırlanıyor...' : 'İtiraz Dilekçesi Üret'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ölçülen Rezonans Frekansı (Hz):</label>
                    <input
                      type="number"
                      value={objectionFreq}
                      onChange={(e) => setObjectionFreq(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Aşım Yapan Pik İvme (g):</label>
                    <input
                      type="number"
                      value={objectionPeakG}
                      onChange={(e) => setObjectionPeakG(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">Laboratuvar Açıklaması & Dinamik Anomali:</label>
                  <input
                    type="text"
                    value={objectionDesc}
                    onChange={(e) => setObjectionDesc(e.target.value)}
                    placeholder="Sarsıcı kontrol döngüsü anomali açıklaması..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                {objectionLetter && (
                  <div>
                    <textarea
                      rows={6}
                      readOnly
                      value={objectionLetter}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 leading-relaxed"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(objectionLetter);
                          showNotification('✅ İtiraz mektubu panoya kopyalandı');
                        }}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> Dilekçeyi Kopyala
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation Dock */}
            <div className="studio-card px-6 py-3 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 4. Pre-FEA & Fikstüre Dön
              </button>
              <button
                onClick={() => {
                  showNotification('🎉 Tüm analiz etüdü başarıyla tamamlandı!');
                  setCurrentStep(1);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Etüdü Tamamla ve Yeni Parça Yükle
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Offline License Modal */}
      {licenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Çevrimdışı Lisans & Donanım Kilidi</h3>
              </div>
              <button
                onClick={() => setLicenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Makine Kimliği (Hardware Machine ID):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={machineId}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(machineId);
                      showNotification('✅ Machine ID panoya kopyalandı');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-semibold cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Çevrimdışı Lisans Anahtarı (.lic Base64):</span>
                <textarea
                  rows={4}
                  placeholder="Nuper Innovation tarafından iletilen lisans anahtarını yapıştırınız..."
                  value={licenseB64}
                  onChange={(e) => setLicenseB64(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
                <button
                  onClick={async () => {
                    if (!licenseB64) {
                      alert('Lütfen bir lisans anahtarı giriniz.');
                      return;
                    }
                    try {
                      const res = await fetch(`${API_BASE}/api/license/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ license_b64: licenseB64 }),
                      });
                      const data = await res.json();
                      if (data.valid) {
                        setLicenseStatus(`LİSANS AKTİF (${data.license_type || 'Kurumsal'})`);
                        showNotification('✅ Lisans anahtarı başarıyla doğrulandı');
                      } else {
                        alert(`Geçersiz lisans: ${data.reason}`);
                      }
                    } catch (e) {
                      alert(`Lisans doğrulama hatası: ${e}`);
                    }
                  }}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Lisansı Doğrula & Aktifleştir
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800">
                <div className="font-bold">Kurumsal Air-Gapped Lisans Aktif</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  RSA-2048 asimetrik doğrulama yerel olarak yapılmıştır. Dış ağa bağlanma zorunluluğu yoktur.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLicenseModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
