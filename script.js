/* Quiz App JS
   - 30s timer per question
   - multiple subjects and categories
   - hint button
   - minimal UI logic
*/

const app = (function(){
  // DOM Elements
  const pages = {
    login: document.getElementById('login-page'),
    subject: document.getElementById('subject-page'),
    category: document.getElementById('category-page'),
    quiz: document.getElementById('quiz-page'),
    result: document.getElementById('result-page')
  };
  const usernameInput = document.getElementById('username');
  const startBtn = document.getElementById('start-btn');
  const subjectBtns = document.querySelectorAll('.subject-btn');
  const subBack = document.getElementById('sub-back');
  const categoriesDiv = document.getElementById('categories');
  const catHeading = document.getElementById('cat-heading');
  const catSubtitle = document.getElementById('cat-subtitle');
  const catBack = document.getElementById('cat-back');

  // Quiz elements
  const quizUser = document.getElementById('quiz-user');
  const quizSubcat = document.getElementById('quiz-subcat');
  const questionText = document.getElementById('question-text');
  const optionsDiv = document.getElementById('options');
  const nextBtn = document.getElementById('next-btn');
  const quitBtn = document.getElementById('quit-btn');
  const hintBtn = document.getElementById('hint-btn');
  const hintText = document.getElementById('hint-text');
  const timeText = document.getElementById('time-text');
  const timebar = document.getElementById('timebar');
  const qCount = document.getElementById('question-count');
  const scoreDisplay = document.getElementById('score-display');

  // Result elems
  const resultMsg = document.getElementById('result-msg');
  const resultName = document.getElementById('result-name');
  const resultScore = document.getElementById('result-score');
  const resultTotal = document.getElementById('result-total');
  const resultPercent = document.getElementById('result-percent');
  const retryBtn = document.getElementById('retry-btn');
  const homeBtn = document.getElementById('home-btn');

  // State
  let state = {
    user: '',
    subject: '',
    category: '',
    questionList: [],
    currentIndex: 0,
    score: 0,
    timer: null,
    timeLeft: 30,
    answered: false
  };

  // Timer config
  const QUESTION_TIME = 30; // seconds

  // Data: Questions bank
  // NOTE: We generate 20 questions per category (3 categories per subject) => 180 total.
  // Each question: {q, options:[], answer: index, hint}
  const QUESTIONS = {
    science: {
      physics: [
        {q:"What is the SI unit of force?", options:["Newton","Pascal","Joule","Watt"], answer:0, hint:"Named after Isaac Newton."},
        {q:"Which law explains inertia?", options:["Newton's First Law","Newton's Second Law","Law of Conservation","Hooke's Law"], answer:0, hint:"An object at rest stays at rest."},
        {q:"What is the speed of light (approx.)?", options:["3 x 10^8 m/s","3 x 10^6 m/s","3 x 10^5 m/s","3 x 10^7 m/s"], answer:0, hint:"It's about 300,000 km/s."},
        {q:"Unit of electric current?", options:["Ampere","Ohm","Volt","Coulomb"], answer:0, hint:"Short form: A."},
        {q:"What causes refraction?", options:["Change of speed","Change of mass","Friction","Electric field"], answer:0, hint:"Occurs when wave enters a different medium."},
        {q:"What is momentum?", options:["Mass x velocity","Mass + velocity","Force x time","Energy x time"], answer:0, hint:"Product of mass and velocity."},
        {q:"What is potential energy?", options:["Energy due to position","Energy due to motion","Heat energy","Light energy"], answer:0, hint:"Think of a ball on a hill."},
        {q:"What kind of wave is light?", options:["Electromagnetic","Mechanical","Longitudinal","Surface"], answer:0, hint:"Does not require a medium."},
        {q:"Which particle orbits the nucleus?", options:["Electron","Proton","Neutron","Positron"], answer:0, hint:"Negative charge."},
        {q:"What is frequency measured in?", options:["Hertz","Newton","Tesla","Ohm"], answer:0, hint:"Cycles per second."},
        {q:"What is acceleration?", options:["Change in velocity per time","Distance per time","Velocity per distance","Mass per time"], answer:0, hint:"Rate of change of velocity."},
        {q:"Which force holds the nucleus together?", options:["Strong nuclear force","Gravity","Friction","Magnetic"], answer:0, hint:"Strongest force at subatomic scale."},
        {q:"Unit of energy?", options:["Joule","Watt","Pascal","Henry"], answer:0, hint:"Symbol: J."},
        {q:"What is Ohm's law?", options:["V = IR","F = ma","E = mc^2","P = VI"], answer:0, hint:"Relates voltage, current, resistance."},
        {q:"What is work?", options:["Force x displacement","Mass x acceleration","Energy/time","Voltage x current"], answer:0, hint:"When a force moves an object."},
        {q:"What causes buoyancy?", options:["Upward pressure from fluid","Gravity alone","Friction","Electric repulsion"], answer:0, hint:"Why boats float."},
        {q:"Mirror that converges light?", options:["Concave mirror","Convex mirror","Plane mirror","Bifocal"], answer:0, hint:"Like a magnifying mirror."},
        {q:"Unit of pressure?", options:["Pascal","Newton","Joule","Watt"], answer:0, hint:"1 Pa = 1 N/m^2."},
        {q:"What is resonance?", options:["Amplified vibration at natural frequency","Decrease in amplitude","Zero motion","Random variation"], answer:0, hint:"Think of a swing pushed at right times."},
        {q:"Which color has lowest wavelength visible to humans?", options:["Red","Violet","Green","Blue"], answer:0, hint:"This is a common trick question — red has longest wavelength; violet shortest."}
      ],
      chemistry: [
        {q:"What is H2O?", options:["Water","Hydrogen peroxide","Hydrochloric acid","Ammonia"], answer:0, hint:"Essential for life."},
        {q:"pH less than 7 indicates?", options:["Acidic","Basic","Neutral","Saline"], answer:0, hint:"Lemon juice is an example."},
        {q:"Atomic number represents?", options:["Number of protons","Number of neutrons","Mass number","Number of orbitals"], answer:0, hint:"Unique to each element."},
        {q:"Which gas is produced by fermentation?", options:["Carbon dioxide","Oxygen","Nitrogen","Helium"], answer:0, hint:"Bubbles in bread dough."},
        {q:"Common salt is?", options:["Sodium chloride","Potassium chloride","Sodium carbonate","Calcium carbonate"], answer:0, hint:"Table salt."},
        {q:"Rust is formed on iron by reaction with?", options:["Oxygen & water","Nitrogen","Carbon monoxide","Hydrogen"], answer:0, hint:"Red-brown flaky layer."},
        {q:"Which element is a noble gas?", options:["Neon","Chlorine","Sodium","Magnesium"], answer:0, hint:"Used in neon lights."},
        {q:"What is a molecule?", options:["Two or more atoms bonded","Single atom","Free electron","Crystal lattice"], answer:0, hint:"Water (H2O) is a molecule."},
        {q:"Avogadro's number approximates to?", options:["6.02 x 10^23","3.14","9.81","1.6 x 10^-19"], answer:0, hint:"Used for number of particles in a mole."},
        {q:"Which bond shares electrons?", options:["Covalent bond","Ionic bond","Metallic bond","Hydrogen bond"], answer:0, hint:"Like in H2."},
        {q:"Indicator turns red in acid?", options:["Litmus","Phenolphthalein","bromothymol blue","methyl orange (depends)"], answer:0, hint:"Common school indicator."},
        {q:"Electrolysis uses what to drive reaction?", options:["Electric current","Heat","Light","Pressure"], answer:0, hint:"Splits water into H2 and O2."},
        {q:"Which is a hydrocarbon?", options:["Methane","Sodium hydroxide","Ethanol","Acetic acid"], answer:0, hint:"Simplest: CH4."},
        {q:"Concentration of solute in solution is called?", options:["Molarity","Velocity","Density","Resistance"], answer:0, hint:"Moles per liter."},
        {q:"What is catalyst?", options:["Speeds reaction without being consumed","Consumed reactant","Product","Solvent"], answer:0, hint:"Lowers activation energy."},
        {q:"Which acid is in vinegar?", options:["Acetic acid","Sulfuric acid","Hydrochloric","Nitric"], answer:0, hint:"Gives sour taste."},
        {q:"Endothermic reaction absorbs?", options:["Heat","Light","Sound","Electricity"], answer:0, hint:"Temperature drops."},
        {q:"Which is an alkali metal?", options:["Sodium","Iron","Calcium","Copper"], answer:0, hint:"Highly reactive with water."},
        {q:"What is polymer?", options:["Long chain of repeating units","Single molecule","Ionic crystal","Gas"], answer:0, hint:"Plastics are examples."},
        {q:"What is oxidation in simple terms?", options:["Loss of electrons","Gain of electrons","Change of color","Melting"], answer:0, hint:"LEO says GER (lose e = oxidation)."}
      ],
      biology: [
        {q:"What is the basic unit of life?", options:["Cell","Atom","Molecule","Organ"], answer:0, hint:"Discovered by Hooke and others."},
        {q:"Which organ pumps blood?", options:["Heart","Lungs","Liver","Kidney"], answer:0, hint:"Human circulatory pump."},
        {q:"Process plants use to make food?", options:["Photosynthesis","Respiration","Digestion","Transpiration"], answer:0, hint:"Requires sunlight."},
        {q:"Which pigment gives green color to leaves?", options:["Chlorophyll","Carotene","Melanin","Haemoglobin"], answer:0, hint:"Absorbs light for photosynthesis."},
        {q:"Where does fertilization occur in humans?", options:["Fallopian tube","Uterus","Vagina","Ovary"], answer:0, hint:"Also called oviduct."},
        {q:"What carries genetic information?", options:["DNA","RNA","Protein","Lipid"], answer:0, hint:"Double helix."},
        {q:"What organelle is powerhouse?", options:["Mitochondria","Ribosome","Golgi body","Nucleus"], answer:0, hint:"Produces ATP."},
        {q:"Which blood cells fight infection?", options:["White blood cells","Red blood cells","Platelets","Plasma cells"], answer:0, hint:"Immune system cells."},
        {q:"What is respiration release?", options:["Energy","Oxygen","Food","Water"], answer:0, hint:"Opposite of photosynthesis in some ways."},
        {q:"Which structure aids in gas exchange in lungs?", options:["Alveoli","Bronchioles","Trachea","Rib"], answer:0, hint:"Tiny air sacs."},
        {q:"Plants release which gas during photosynthesis?", options:["Oxygen","Carbon dioxide","Nitrogen","Methane"], answer:0, hint:"We breathe it."},
        {q:"Which sugar is in blood?", options:["Glucose","Sucrose","Fructose","Lactose"], answer:0, hint:"Primary energy source for cells."},
        {q:"What type of reproduction uses one parent?", options:["Asexual","Sexual","Cross","Fertilization"], answer:0, hint:"Binary fission is an example."},
        {q:"Which is not a mammal?", options:["Crocodile","Human","Whale","Bat"], answer:0, hint:"Cold-blooded reptile."},
        {q:"What is osmosis?", options:["Movement of water across membrane","Movement of solute against gradient","Heat transfer","Diffusion of gases"], answer:0, hint:"Water moves to equalize concentration."},
        {q:"Which vitamin is made in skin with sunlight?", options:["Vitamin D","Vitamin C","Vitamin A","Vitamin K"], answer:0, hint:"Prevents rickets."},
        {q:"Which organ removes waste from blood?", options:["Kidney","Heart","Stomach","Lung"], answer:0, hint:"Filters and makes urine."},
        {q:"Which system controls hormones?", options:["Endocrine","Circulatory","Digestive","Respiratory"], answer:0, hint:"Glands secrete hormones."},
        {q:"What are producers in ecosystem?", options:["Plants","Animals","Fungi","Bacteria"], answer:0, hint:"Make their own food."},
        {q:"Which process forms seeds in flowering plants?", options:["Pollination","Germination","Photosynthesis","Transpiration"], answer:0, hint:"Pollen transfer leads to fertilization."}
      ]
    },
    math: {
      arithmetic: [
        {q:"What is 25 + 17?", options:["42","40","52","34"], answer:0, hint:"Add units then tens."},
        {q:"What is 9 × 8?", options:["72","81","64","69"], answer:0, hint:"9 times table."},
        {q:"What is 144 ÷ 12?", options:["12","10","14","11"], answer:0, hint:"12×12 = 144."},
        {q:"What is 15% of 200?", options:["30","20","15","25"], answer:0, hint:"10% =20, 5% =10."},
        {q:"What is 2³?", options:["8","6","4","9"], answer:0, hint:"2×2×2."},
        {q:"What is 0 × 999?", options:["0","999","1","-999"], answer:0, hint:"Anything times zero."},
        {q:"What is the square of 7?", options:["49","42","56","36"], answer:0, hint:"7×7."},
        {q:"What is 1/2 + 1/4?", options:["3/4","1/4","2/4","1"], answer:0, hint:"Common denominator."},
        {q:"What is 20 - 7?", options:["13","12","14","7"], answer:0, hint:"Simple subtraction."},
        {q:"What is 45 ÷ 9?", options:["5","6","7","4"], answer:0, hint:"9×5=45."},
        {q:"What is 3.5 + 2.25?", options:["5.75","6.25","5.25","4.25"], answer:0, hint:"Add decimals."},
        {q:"What is 1000 - 1?", options:["999","100","900","990"], answer:0, hint:"One less than 1000."},
        {q:"What is half of 60?", options:["30","40","20","15"], answer:0, hint:"Divide by 2."},
        {q:"What is 7 × 6?", options:["42","36","48","40"], answer:0, hint:"Classic times table."},
        {q:"What is 81 ÷ 9?", options:["9","8","7","10"], answer:0, hint:"9×9=81."},
        {q:"What is 11 + 11?", options:["22","20","21","23"], answer:0, hint:"Double 11."},
        {q:"What is 0.5 × 0.5?", options:["0.25","0.5","1","0.05"], answer:0, hint:"Half times half."},
        {q:"What is 2 + 2 × 2?", options:["6","8","4","10"], answer:0, hint:"Order of operations."},
        {q:"What is 7 squared minus 6?", options:["43","49","36","37"], answer:0, hint:"7²=49."},
        {q:"What is 13 + 14?", options:["27","26","25","28"], answer:0, hint:"Add units then tens."}
      ],
      algebra: [
        {q:"Solve x: 2x = 10", options:["5","10","2","8"], answer:0, hint:"Divide both sides by 2."},
        {q:"If x+3=7, x=?", options:["4","5","3","7"], answer:0, hint:"Subtract 3."},
        {q:"What is 3x when x=4?", options:["12","7","10","16"], answer:0, hint:"Multiply."},
        {q:"Solve: x - 5 = 0", options:["5","0","-5","10"], answer:0, hint:"Add 5."},
        {q:"If 5x = 25, x = ?", options:["5","4","10","3"], answer:0, hint:"Divide by 5."},
        {q:"What is x if 2x + 4 = 10?", options:["3","2","4","1"], answer:0, hint:"2x=6."},
        {q:"If x/3 = 4, x = ?", options:["12","7","1","3"], answer:0, hint:"Multiply both sides by 3."},
        {q:"Simplify: 2(x + 3)", options:["2x + 6","2x + 3","x + 6","2x - 3"], answer:0, hint:"Distribute 2."},
        {q:"Solve: x^2 = 16 (positive root)", options:["4","-4","8","2"], answer:0, hint:"Square root of 16."},
        {q:"What is 2a + 3a?", options:["5a","6a","a","-a"], answer:0, hint:"Combine like terms."},
        {q:"If 3x = 9, x = ?", options:["3","6","2","1"], answer:0, hint:"Divide by 3."},
        {q:"What is slope of y=2x+3?", options:["2","3","1","-2"], answer:0, hint:"Coefficient of x."},
        {q:"Solve: x + x + x = 9", options:["3","9","1","27"], answer:0, hint:"3x=9."},
        {q:"If x-2=3, x=?", options:["5","1","3","4"], answer:0, hint:"Add 2."},
        {q:"What is (x)(0)?", options:["0","x","1","undefined"], answer:0, hint:"Anything times 0."},
        {q:"Simplify: 4x - 2x", options:["2x","6x","-2x","4x"], answer:0, hint:"Subtract coefficients."},
        {q:"If x=2, what is x^3?", options:["8","6","4","9"], answer:0, hint:"2×2×2."},
        {q:"Solve: x/2 = 5", options:["10","2.5","5","7"], answer:0, hint:"Multiply both sides by 2."},
        {q:"If 7x=0, then x=?", options:["0","7","1","-7"], answer:0, hint:"Only zero times anything gives zero."},
        {q:"Simplify: (2x)(3)", options:["6x","5x","2x+3","x"], answer:0, hint:"Multiply coefficient."}
      ],
      geometry: [
        {q:"How many degrees in a triangle?", options:["180","360","90","270"], answer:0, hint:"Sum of interior angles."},
        {q:"A square has how many sides?", options:["4","3","5","6"], answer:0, hint:"All sides equal."},
        {q:"Area of rectangle formula?", options:["length × width","2×(l+w)","base × height / 2","πr²"], answer:0, hint:"Multiply length and width."},
        {q:"Perimeter of a square side s?", options:["4s","s","2s","s²"], answer:0, hint:"Four equal sides."},
        {q:"Right angle measures:", options:["90°","45°","180°","60°"], answer:0, hint:"Corner of a square."},
        {q:"Circle's radius is half of its ____?", options:["Diameter","Circumference","Area","Chord"], answer:0, hint:"D = 2r."},
        {q:"Area of triangle?", options:["(base × height)/2","base × height","πr²","2πr"], answer:0, hint:"Half of rectangle."},
        {q:"What is a polygon?", options:["Closed multi-sided shape","Open curve","Single point","Line"], answer:0, hint:"Triangle, square are examples."},
        {q:"How many vertices in a pentagon?", options:["5","4","6","3"], answer:0, hint:"Same as its sides."},
        {q:"Sum of exterior angles of any polygon equals?", options:["360°","180°","90°","720°"], answer:0, hint:"Walk around polygon."},
        {q:"A cube has how many faces?", options:["6","8","12","4"], answer:0, hint:"Like a dice."},
        {q:"What is a scalene triangle?", options:["No equal sides","All equal sides","Two equal sides","Right triangle"], answer:0, hint:"All sides different."},
        {q:"What is a median of a triangle?", options:["Line from vertex to midpoint of opposite side","Perpendicular bisector","Radius of circumcircle","Angle bisector"], answer:0, hint:"Splits opposite side into equal parts."},
        {q:"Which shape has constant width in all directions?", options:["Circle","Rectangle","Triangle","Square"], answer:0, hint:"Round shape."},
        {q:"What is volume unit for cube with side a?", options:["a³","a²","a","3a"], answer:0, hint:"Multiply three sides."},
        {q:"What shape is a regular hexagon?", options:["Six equal sides","Five sides","Four sides","Seven sides"], answer:0, hint:"Like a honeycomb cell."},
        {q:"What is parallel lines property?", options:["Never meet","Always meet","Intersect at right angle","Curved"], answer:0, hint:"Same direction."},
        {q:"What is a chord in a circle?", options:["A line connecting two points on circle","Radius","Diameter","Tangent"], answer:0, hint:"Shorter than diameter."},
        {q:"Area of circle formula?", options:["πr²","2πr","πd","r²"], answer:0, hint:"Classic formula."},
        {q:"What is a right triangle's hypotenuse?", options:["Longest side opposite right angle","Shortest side","Altitude","Median"], answer:0, hint:"Use Pythagoras."}
      ]
    },
    gk: {
      history: [
        {q:"Who was the first President of the United States?", options:["George Washington","Abraham Lincoln","Thomas Jefferson","John Adams"], answer:0, hint:"Also commander-in-chief of Continental Army."},
        {q:"Which ancient civilization built pyramids in Egypt?", options:["Egyptians","Romans","Greeks","Mayans"], answer:0, hint:"Nile river civilization."},
        {q:"Who discovered America in 1492 (European navigator)?", options:["Christopher Columbus","Marco Polo","Magellan","Vasco da Gama"], answer:0, hint:"Sailed for Spain."},
        {q:"What was the Renaissance?", options:["Cultural rebirth in Europe","A war","A type of ship","A disease"], answer:0, hint:"Art and learning revival."},
        {q:"Who led India to independence from British rule?", options:["Mahatma Gandhi","Winston Churchill","Napoleon","George V"], answer:0, hint:"Famous for non-violence."},
        {q:"Which empire was ruled by Julius Caesar?", options:["Roman Empire","Ottoman Empire","Mongol Empire","Persian Empire"], answer:0, hint:"Centered on Rome."},
        {q:"When did World War II end (year)?", options:["1945","1918","1939","1950"], answer:0, hint:"Mid 1940s."},
        {q:"Which ancient river valley had early civilization in India?", options:["Indus","Ganges","Nile","Amazon"], answer:0, hint:"Harappa and Mohenjo-daro."},
        {q:"Who wrote the Iliad and Odyssey?", options:["Homer","Shakespeare","Tolstoy","Virgil"], answer:0, hint:"Ancient Greek poet."},
        {q:"Which civilization used cuneiform writing?", options:["Mesopotamia","Egypt","China","Greece"], answer:0, hint:"Between Tigris & Euphrates."},
        {q:"What was the Great Wall built for?", options:["Defense","Trade","Religion","Irrigation"], answer:0, hint:"To keep out invaders."},
        {q:"Who was known as the 'Iron Lady'?", options:["Margaret Thatcher","Indira Gandhi","Angela Merkel","Golda Meir"], answer:0, hint:"Former UK Prime Minister."},
        {q:"Where did the Industrial Revolution begin?", options:["Britain","America","France","Japan"], answer:0, hint:"Late 18th century."},
        {q:"Who was the first man to walk on the Moon?", options:["Neil Armstrong","Buzz Aldrin","Yuri Gagarin","Michael Collins"], answer:0, hint:"Famous quote 'one small step...'"},
        {q:"Which empire did Genghis Khan found?", options:["Mongol Empire","Roman Empire","Persian Empire","Ottoman Empire"], answer:0, hint:"From Central Asia."},
        {q:"Who painted the Mona Lisa?", options:["Leonardo da Vinci","Michelangelo","Raphael","Van Gogh"], answer:0, hint:"Renaissance polymath."},
        {q:"Which event started World War I?", options:["Assassination of Archduke Franz Ferdinand","Bombing of Pearl Harbor","Fall of Berlin Wall","French Revolution"], answer:0, hint:"Occurred in Sarajevo."},
        {q:"Which ancient city was buried by Vesuvius?", options:["Pompeii","Athens","Carthage","Troy"], answer:0, hint:"Preserved ruins in Italy."},
        {q:"Who wrote the 'Declaration of Independence' (main author)?", options:["Thomas Jefferson","Benjamin Franklin","John Hancock","Alexander Hamilton"], answer:0, hint:"Third US President."},
        {q:"Which dynasty built the Great Pyramid at Giza?", options:["Fourth Dynasty of Egypt","Ming Dynasty","Roman Empire","Maurya Dynasty"], answer:0, hint:"Pharaoh Khufu's era."}
      ],
      geography: [
        {q:"Which is the largest ocean?", options:["Pacific Ocean","Atlantic Ocean","Indian Ocean","Arctic Ocean"], answer:0, hint:"East of Asia."},
        {q:"Which is the longest river in the world?", options:["Nile","Amazon","Yangtze","Mississippi"], answer:0, hint:"Debated, but classic answer is Nile."},
        {q:"Which continent is India in?", options:["Asia","Africa","Europe","Australia"], answer:0, hint:"Largest continent."},
        {q:"Mount Everest is located in which mountain range?", options:["Himalayas","Andes","Rockies","Alps"], answer:0, hint:"Tallest peak on Earth."},
        {q:"Which country has the largest population?", options:["China","India","USA","Indonesia"], answer:0, hint:"As of recent decades."},
        {q:"Which is a landlocked country?", options:["Nepal","Sri Lanka","Japan","Australia"], answer:0, hint:"No sea border."},
        {q:"Which sea lies to the west of India?", options:["Arabian Sea","Bay of Bengal","Andaman Sea","Red Sea"], answer:0, hint:"Between India and Arabian peninsula."},
        {q:"Capital of France?", options:["Paris","Berlin","Madrid","Rome"], answer:0, hint:"City of light."},
        {q:"Which is the smallest continent by area?", options:["Australia","Europe","Antarctica","South America"], answer:0, hint:"Also a country."},
        {q:"Which country is known as 'Land of the Rising Sun'?", options:["Japan","China","Korea","Thailand"], answer:0, hint:"East Asian island nation."},
        {q:"Which is the largest desert?", options:["Sahara","Gobi","Kalahari","Arabian"], answer:0, hint:"In North Africa."},
        {q:"Which ocean borders India to the south?", options:["Indian Ocean","Atlantic","Pacific","Arctic"], answer:0, hint:"Named after region."},
        {q:"Which city is located on two continents (Europe & Asia)?", options:["Istanbul","Cairo","Moscow","Athens"], answer:0, hint:"Former capital of Ottoman Empire."},
        {q:"Which river flows through London?", options:["Thames","Seine","Danube","Rhine"], answer:0, hint:"Famous for bridges."},
        {q:"Which island country is southeast of India?", options:["Sri Lanka","Maldives","Madagascar","Mauritius"], answer:0, hint:"Tropical island nation."},
        {q:"What is the capital of Japan?", options:["Tokyo","Osaka","Kyoto","Hiroshima"], answer:0, hint:"Host of 2020 Olympics."},
        {q:"Which line divides Earth into Northern & Southern hemispheres?", options:["Equator","Prime Meridian","Tropic of Cancer","Arctic Circle"], answer:0, hint:"Latitude 0°."},
        {q:"Which mountain range runs down South America?", options:["Andes","Himalayas","Alps","Rockies"], answer:0, hint:"Longest continental range."},
        {q:"Which country has the most time zones?", options:["France (overseas)","USA","Russia","China"], answer:0, hint:"Count includes overseas territories."},
        {q:"Which is the largest island in the world?", options:["Greenland","New Guinea","Borneo","Madagascar"], answer:0, hint:"Near Arctic circle."}
      ],
      current_affairs: [
        {q:"Which global event focuses on climate action?", options:["COP (Conference of Parties)","Olympics","World Cup","FT Summit"], answer:0, hint:"Annual UN climate conference."},
        {q:"Which organisation runs the World Health Organization?", options:["United Nations","European Union","WHO itself","NATO"], answer:0, hint:"WHO is a UN agency."},
        {q:"What does 'GDP' stand for?", options:["Gross Domestic Product","General Development Plan","Global Distribution Protocol","Gross Domestic People"], answer:0, hint:"Measures national output."},
        {q:"Which technology is used for cryptocurrency?", options:["Blockchain","SMTP","HTTP","FTP"], answer:0, hint:"Distributed ledger."},
        {q:"Which energy source is renewable?", options:["Solar","Coal","Oil","Natural Gas"], answer:0, hint:"Comes from the sun."},
        {q:"What is an example of a social media platform?", options:["Twitter","Telephone","Newspaper","Radio"], answer:0, hint:"Microblogging site."},
        {q:"Which is a major global stock index?", options:["S&P 500","BMI","CPI","HDI"], answer:0, hint:"Tracks large U.S. companies."},
        {q:"What does 'AI' stand for?", options:["Artificial Intelligence","Automatic Information","Active Internet","Applied Innovation"], answer:0, hint:"Computers doing human-like tasks."},
        {q:"Which device lets you access the internet wirelessly?", options:["Wi-Fi router","Wired modem","Printer","Keyboard"], answer:0, hint:"Provides wireless network."},
        {q:"Which country launched the James Webb Space Telescope collaboration with NASA? (partner)", options:["ESA (Europe)","India","Canada","Japan"], answer:0, hint:"European Space Agency contributed."},
        {q:"Which sector includes apps, websites, and servers?", options:["Technology","Agriculture","Textiles","Retail"], answer:0, hint:"Often abbreviated 'IT'."},
        {q:"Which is a major search engine?", options:["Google","Yellow Pages","Phonebook","Fax"], answer:0, hint:"Starts with 'G'."},
        {q:"What is electrification a part of?", options:["Infrastructure development","Cosmetics","Food industry","Textiles"], answer:0, hint:"Providing electricity to places."},
        {q:"Which event is typically used to discuss global economics?", options:["G20 summit","Fashion Week","Comic Con","World Cup"], answer:0, hint:"Group of 20 major economies."},
        {q:"Which health issue was declared a pandemic in 2020?", options:["COVID-19","Zika","SARS","MERS"], answer:0, hint:"Caused major global impact."},
        {q:"Which sector is responsible for crops and farming?", options:["Agriculture","Finance","IT","Mining"], answer:0, hint:"Farms and fields."},
        {q:"Which is a clean fuel option for transport being developed widely?", options:["Electric vehicles","Coal cars","Diesel paddle","Gasoline only"], answer:0, hint:"Runs on batteries."},
        {q:"What does 'UN' stand for?", options:["United Nations","Universal Network","Union of Nations","United Network"], answer:0, hint:"International organization founded in 1945."},
        {q:"Which global issue relates to rising average temperatures?", options:["Climate change","Deflation","Ozone healing","Population drop"], answer:0, hint:"Caused by greenhouse gases."},
        {q:"Which currency is used in Japan?", options:["Yen","Dollar","Euro","Rupee"], answer:0, hint:"Symbol ¥."}
      ]
    }
  };

  // Category lists for UI
  const CATEGORIES = {
    science: [
      {key:'physics', label:'Physics ⚛️', style:'blue'},
      {key:'chemistry', label:'Chemistry ⚗️', style:'purple'},
      {key:'biology', label:'Biology 🧬', style:'pink'}
    ],
    math: [
      {key:'arithmetic', label:'Arithmetic ➕', style:'blue'},
      {key:'algebra', label:'Algebra 🔢', style:'purple'},
      {key:'geometry', label:'Geometry 📐', style:'pink'}
    ],
    gk: [
      {key:'history', label:'History 📜', style:'blue'},
      {key:'geography', label:'Geography 🗺️', style:'purple'},
      {key:'current_affairs', label:'Current Affairs 📰', style:'pink'}
    ]
  };

  // Helpers
  function showPage(pageName){
    for(const k in pages){
      pages[k].classList.remove('active');
    }
    pages[pageName].classList.add('active');
  }

  function start(){
    const name = usernameInput.value.trim() || 'Student';
    state.user = name;
    showPage('subject');
  }

  // Subject selection handlers
  function onSubjectSelect(e){
    const s = e.currentTarget.dataset.subject;
    state.subject = s;
    // highlight
    subjectBtns.forEach(b=>b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    openCategoryPage();
  }

  function openCategoryPage(){
    const s = state.subject;
    catHeading.textContent = `Choose Category — ${capitalize(s)}`;
    catSubtitle.textContent = `Pick a category within ${capitalize(s)}.`;
    categoriesDiv.innerHTML = '';
    for(const cat of CATEGORIES[s]){
      const btn = document.createElement('button');
      btn.className = `btn-card`;
      btn.textContent = cat.label;
      btn.dataset.cat = cat.key;
      if(cat.style==='blue') btn.classList.add('active');
      if(cat.style==='purple') btn.classList.add('purple');
      if(cat.style==='pink') btn.classList.add('pink');
      btn.addEventListener('click', onCategoryClick);
      categoriesDiv.appendChild(btn);
    }
    showPage('category');
  }

  function onCategoryClick(e){
    const cat = e.currentTarget.dataset.cat;
    state.category = cat;
    // build question list from QUESTIONS
    const list = QUESTIONS[state.subject][state.category];
    // clone list to avoid mutating original
    state.questionList = shuffleArray(list.map(q=>Object.assign({}, q)));
    state.currentIndex = 0;
    state.score = 0;
    scoreDisplay.textContent = `Score: ${state.score}`;
    startQuiz();
  }

  // Quiz flow
  function startQuiz(){
    quizUser.textContent = `${state.user}`;
    quizSubcat.textContent = `${capitalize(state.subject)} • ${formatCategoryLabel(state.subject,state.category)}`;
    showPage('quiz');
    loadQuestion();
  }

  function loadQuestion(){
    clearTimer();
    hintText.textContent = '';
    hintBtn.disabled = false;
    state.answered = false;
    const idx = state.currentIndex;
    const total = state.questionList.length;
    if(idx >= total){
      showResult();
      return;
    }
    const qobj = state.questionList[idx];
    qCount.textContent = `Question ${idx+1} / ${total}`;
    questionText.textContent = `${qobj.q} ${maybeAddEmojiToQuestion(qobj.q)}`;
    optionsDiv.innerHTML = '';
    qobj.options.forEach((opt, i)=>{
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.textContent = opt;
      b.dataset.index = i;
      b.addEventListener('click', ()=>selectOption(b, i));
      optionsDiv.appendChild(b);
    });
    nextBtn.disabled = true;
    updateTimer(QUESTION_TIME);
    startTimer(QUESTION_TIME);
  }

  function selectOption(btn, idx){
    if(state.answered) return;
    state.answered = true;
    // disable all
    const all = optionsDiv.querySelectorAll('.option-btn');
    all.forEach(o=>{ o.classList.add('disabled'); });
    const qobj = state.questionList[state.currentIndex];
    // mark selected
    btn.classList.add('selected');
    if(idx === qobj.answer){
      btn.classList.add('correct');
      state.score += 1;
      scoreDisplay.textContent = `Score: ${state.score}`;
    } else {
      btn.classList.add('wrong');
      // reveal correct
      const correctBtn = [...all].find(x=>Number(x.dataset.index)===qobj.answer);
      if(correctBtn) correctBtn.classList.add('correct');
    }
    stopTimerAndAdvance(); // stop timer, allow next
  }

  function stopTimerAndAdvance(){
    clearTimer();
    nextBtn.disabled = false;
  }

  function nextQuestion(){
    state.currentIndex += 1;
    loadQuestion();
  }

  // Timer funcs
  function updateTimer(seconds){
    state.timeLeft = seconds;
    timeText.textContent = `${seconds}s`;
    const pct = (seconds / QUESTION_TIME) * 100;
    timebar.style.width = `${pct}%`;
  }

  function tick(){
    state.timeLeft -= 1;
    if(state.timeLeft < 0){
      // time up
      clearTimer();
      handleTimeout();
      return;
    }
    timeText.textContent = `${state.timeLeft}s`;
    const pct = (state.timeLeft / QUESTION_TIME) * 100;
    timebar.style.width = `${pct}%`;
  }

  function startTimer(seconds){
    updateTimer(seconds);
    state.timer = setInterval(tick, 1000);
  }

  function clearTimer(){
    if(state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function stopTimer(){
    clearTimer();
  }

  function handleTimeout(){
    // mark as unanswered/incorrect and reveal correct answer
    state.answered = true;
    const all = optionsDiv.querySelectorAll('.option-btn');
    all.forEach(o=>o.classList.add('disabled'));
    const qobj = state.questionList[state.currentIndex];
    const correctBtn = [...all].find(x=>Number(x.dataset.index)===qobj.answer);
    if(correctBtn) correctBtn.classList.add('correct');
    nextBtn.disabled = false;
  }

  // Hint
  function showHint(){
    const qobj = state.questionList[state.currentIndex];
    hintText.textContent = qobj.hint || 'No hint available';
    hintBtn.disabled = true;
  }

  // Result
  function showResult(){
    stopTimer();
    showPage('result');
    resultName.textContent = `${state.user} — ${capitalize(state.subject)} / ${formatCategoryLabel(state.subject,state.category)}`;
    resultScore.textContent = state.score;
    resultTotal.textContent = state.questionList.length;
    const pct = Math.round((state.score / state.questionList.length) * 100);
    resultPercent.textContent = `${pct}%`;
    if(pct >= 80) resultMsg.textContent = "Excellent! 🌟";
    else if(pct >= 50) resultMsg.textContent = "Good job! 👍";
    else resultMsg.textContent = "Keep Practicing 💪";
  }

  function retryQuiz(){
    // reset index and score and reshuffle
    state.questionList = shuffleArray(state.questionList.map(q=>Object.assign({}, q)));
    state.currentIndex = 0;
    state.score = 0;
    scoreDisplay.textContent = `Score: ${state.score}`;
    startQuiz();
  }

  function goHome(){
    state = { user: state.user, subject:'', category:'', questionList:[], currentIndex:0, score:0, timer:null, timeLeft:QUESTION_TIME, answered:false};
    showPage('subject');
  }

  // Utility
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function formatCategoryLabel(subject,cat){
    // map to display label
    const arr = CATEGORIES[subject].find(x=>x.key===cat);
    return arr ? arr.label : cat;
  }
  function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function maybeAddEmojiToQuestion(q){
    // add tiny emoji for fun if question contains certain keywords
    const low = q.toLowerCase();
    if(low.includes('earth') || low.includes('planet')) return '🌎';
    if(low.includes('math') || low.includes('add') || low.includes('sum')) return '➕';
    if(low.includes('history') || low.includes('ancient')) return '📜';
    if(low.includes('science') || low.includes('experiment')) return '🔬';
    return '';
  }

  // Bind events
  function bind(){
    startBtn.addEventListener('click', start);
    subBack.addEventListener('click', ()=> showPage('login'));
    subjectBtns.forEach(b=>b.addEventListener('click', onSubjectSelect));
    catBack.addEventListener('click', ()=> showPage('subject'));
    nextBtn.addEventListener('click', ()=> {
      if(state.currentIndex < state.questionList.length) nextQuestion();
    });
    quitBtn.addEventListener('click', ()=> {
      if(confirm('Quit quiz and return to subjects?')) goHome();
    });
    hintBtn.addEventListener('click', showHint);
    retryBtn.addEventListener('click', retryQuiz);
    homeBtn.addEventListener('click', goHome);
  }

  // Initialize
  function init(){
    bind();
    showPage('login');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ()=>app.init());
