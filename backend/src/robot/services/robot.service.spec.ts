import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RobotService } from './robot.service';
import { Robot, Direction } from '../entities/robot.entity';

describe('RobotService', () => {
  let service: RobotService;
  let repository: Repository<Robot>;

  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RobotService,
        {
          provide: getRepositoryToken(Robot),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RobotService>(RobotService);
    repository = module.get<Repository<Robot>>(getRepositoryToken(Robot));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRobotState', () => {
    it('should save robot state successfully', async () => {
      const robotDto = { x: 1, y: 1, direction: Direction.NORTH };
      const mockRobot = { id: 1, ...robotDto, createdAt: new Date() };

      mockRepository.create.mockReturnValue(mockRobot);
      mockRepository.save.mockResolvedValue(mockRobot);

      const result = await service.saveRobotState(robotDto);

      expect(mockRepository.create).toHaveBeenCalledWith(robotDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRobot);
      expect(result).toEqual(mockRobot);
    });

    it('should save robot state at different positions', async () => {
      const robotDto = { x: 3, y: 4, direction: Direction.EAST };
      const mockRobot = { id: 2, ...robotDto, createdAt: new Date() };

      mockRepository.create.mockReturnValue(mockRobot);
      mockRepository.save.mockResolvedValue(mockRobot);

      const result = await service.saveRobotState(robotDto);

      expect(mockRepository.create).toHaveBeenCalledWith(robotDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRobot);
      expect(result).toEqual(mockRobot);
    });
  });

  describe('getCurrentRobot', () => {
    it('should return the latest robot by ID', async () => {
      const mockRobot = {
        id: 5, x: 2, y: 3, direction: Direction.SOUTH, createdAt: new Date(),
      };
      mockQueryBuilder.getOne.mockResolvedValue(mockRobot);

      const result = await service.getCurrentRobot();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('robot');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('robot.id', 'DESC');
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockRobot);
    });

    it('should return null when no robot exists', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await service.getCurrentRobot();

      expect(result).toBeNull();
    });
  });

  describe('getRobotHistory', () => {
    it('should return robot history ordered by ID descending', async () => {
      const mockHistory = [
        { id: 3, x: 2, y: 2, direction: Direction.EAST, createdAt: new Date() },
        { id: 2, x: 1, y: 2, direction: Direction.NORTH, createdAt: new Date() },
        { id: 1, x: 1, y: 1, direction: Direction.NORTH, createdAt: new Date() },
      ];
      mockRepository.find.mockResolvedValue(mockHistory);

      const result = await service.getRobotHistory();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
      });
      expect(result).toEqual(mockHistory);
    });

    it('should return empty array when no history exists', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getRobotHistory();

      expect(result).toEqual([]);
    });
  });
}); 